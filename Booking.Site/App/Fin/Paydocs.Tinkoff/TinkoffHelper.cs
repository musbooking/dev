using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Itall;
using System.Threading.Tasks;
using LinqToDB;
using My.App.Orders;
using My.App.Partners;
using Microsoft.Extensions.Configuration;

namespace My.App.Fin.Tinkoff
{

    /// <summary>
    /// Сервис для обработки данных платежей через Тиньков
    /// </summary>
    public static class TinkoffHelper
    {
        public static void Config(IConfiguration config)
        {
            config.Bind(Settings);
        }

        public static TinkoffSettings Settings = new TinkoffSettings();

        public class TinkoffSettings
        {
            public string TerminalKey { get; set; }
            //public string TerminalPassword { get; set; }
            public Dictionary<string, Terminal> Terminals { get; set; }
            //public List<Terminal> Terminals { get; set; }
            public string InitUrl { get; set; }
            public string CheckUrl { get; set; }
        }

        public class Terminal
        {
            public string Name { get; set; }
            public string Key { get; set; }
            public string Password { get; set; }
        }


        public class UrlArgs
        {
            public string TerminalKey; //  { get; set; }
            public string Token;
            public string OrderId;
            public string PaymentId;
            public int? Amount;
            public string Description;
            public object Receipt;

            public ShopItem[] Shops;

            public class ShopItem
            {
                public string ShopCode;
                public int Amount;
            }

            public string GetToken(string pasw)
            {
                var token_str = $"{Amount}{Description}{OrderId}{pasw}{PaymentId}{TerminalKey}";
                var token = token_str.ToSHA256();
                return token;
            }
        }



        /// <summary>
        /// Результат подтверждения
        /// </summary>
        public class ConfirmRes
        {
            public string OrderId { get; set; }
            public bool Success { get; set; }
            public string Status { get; set; }
            public int Amount { get; set; }
            public long PaymentId { get; set; }
            public string ErrorCode { get; set; }
            public int RebillId { get; set; }
            public int CardId { get; set; }
            // public BankResConfirmData DATA { get; set; } = new BankResConfirmData(); -- бесполезно, не передается
            // public Dictionary<string, string> DATA { get; set; } = new Dictionary<string, string>();
            public string Token { get; set; }
            public string ExpDate { get; set; }

            public bool IsConfirmed() => Status == "CONFIRMED";
        }

        /// <summary>
        /// Возврат результата создания оплаты
        /// </summary>
        public class UrlRes
        {
            public dynamic Args; // for tests

            public bool Success { get; set; }
            public string ErrorCode { get; set; }
            public string PaymentURL { get; set; }
            public string Message { get; set; }
            public string Details { get; set; }

            public string ErrorText => Success ? null : Message + " " + Details;
        }

        //static (string,string,string) PREFIX = ("ord", "abn", "frf");

        /// <summary>
        /// Преобразование результата работы банка в результат платежа
        /// </summary>
        public static Fin.PaymentRes ConvertBankResArgs2PaymentRes(ConfirmRes args)
        {
            var arr = args.OrderId.Split(":");
            var arr_res = arr switch
            {
                [ID_PREFIX + "1", var id, _] => (PaymentType.Order, id),
                [ID_PREFIX + "2", var id, _] => (PaymentType.Abonement, id),
                [ID_PREFIX + "3", var id, _] => (PaymentType.Forfeit, id),
                [var id, _] => (PaymentType.Forfeit, id),  // для совместимости - старый штраф
                [var id] => (PaymentType.Order, id),  // для совместимости - старый ордер
                _ => (PaymentType.Unknown, null),
            };
            var pay_res = new PaymentRes
            {
                Type = arr_res.Item1,
                Id = Guid.Parse(arr_res.id),
                Total = args.Amount / 100,
                Source = args,
                PaymentId = args.PaymentId,
            };
            //Guid.TryParse(arr_res.id, out pay_res.Id);
            return pay_res;
        }

        const string ID_PREFIX = "t";  // for checking 


        ///// <summary>
        ///// Отправка чека в магазин - 81781
        ///// </summary>
        //public static Task<UrlRes> PostInitAsync(PaymentInfo info)
        //{
        //    var targs = TinkoffHelper.GetMethodArgs(info, TinkoffHelper.PaymentMethod.Init);
        //    var pres = TinkoffHelper.GetUrl(targs, TinkoffHelper.PaymentMethod.Init);
        //    return pres;
        //}

        ///// <summary>
        ///// Отправка чека в магазин - 81781
        ///// </summary>
        //public static Task<UrlRes> PostCheckAsync(PaymentInfo info)
        //{
        //    var targs = TinkoffHelper.GetMethodArgs(info, TinkoffHelper.PaymentMethod.Check);
        //    var pres = TinkoffHelper.GetUrl(targs, TinkoffHelper.PaymentMethod.Check);
        //    return pres;
        //}


        public enum PaymentMethod
        {
            Init,
            Check,
        }


        /// <summary>
        /// Получение аргументов для ссылки оплаты
        /// </summary>
        public static UrlArgs ToInitUrlArgs(this PaymentInfo info)
        {
            var amount = info.Total * 100;
            var prefix = ID_PREFIX + (int)info.Type;
            var suffix = DateTime.Now.ToString("yyMMddHHmm");

            var order_id = $"{prefix}:{info.Id}:{suffix}"; // 3 компонента ИД

            //var token_str = $"{amount}{order_id}{Settings.TerminalPassword}{Settings.TerminalKey}";
            var init_args = new UrlArgs
            {
                TerminalKey = info.Terminal, // ?? Settings.TerminalKey,
                //Token = token_str.ToSHA256(),
                Amount = amount,
                OrderId = order_id,
                //PaymentId = info.Id?.ToString(), // для чеков
                Description = info.Description ?? $"Бронирование {info.Base}",
                //Receipt = receipt,
                Shops = new[] {
                    new  UrlArgs.ShopItem { ShopCode = info.Channel?.PrepayUrl, Amount = amount, }
                },
            };
            var terminal = Settings.Terminals[info.Terminal];
            init_args.Token = init_args.GetToken(terminal.Password);

            if (!string.IsNullOrWhiteSpace(info.Inn))
            {
                init_args.Receipt = new
                {
                    Phone = info.Phone, //телефон клиента
                    Email = info.Email, //почта клиента
                    Taxation = "usn_income_outcome",
                    Items = new[]
                    {
                        new
                        {
                            AgentData = new
                            {
                                AgentSign = "another"
                            },
                            SupplierInfo = new
                            {
                                Phones = info.BasePhones?.Split(',', StringSplitOptions.None) ?? new string[0],

                                //Phones = new[]
                                //{
                                //    info.Base.Phone,
                                //},//телефон(ы) базы
                                Name = info.Base, //название базы
                                Inn = info.Inn //ИНН, указанный в информации о партнёской зоне
                            },
                            Name = "Бронирование творческих услуг Musbooking",
                            Price = amount, //совпадает с amount в самом начале списка параметров
                            Quantity = 1.00,
                            Amount = amount,
                            PaymentMethod = "full_prepayment",
                            PaymentObject = "service",
                            Tax = "none"
                        }
                    }
                };
            }

            //var res = await GetInitUrl(bargs);
            return init_args;
        }

        /// <summary>
        /// Получение аргументов для ссылки оплаты
        /// </summary>
        public static UrlArgs ToCheckUrlArgs(this PaymentInfo info, object payid)
        {
            var amount = info.Total * 100;
            var prefix = ID_PREFIX + (int)info.Type;
            var suffix = DateTime.Now.ToString("yyMMddHHmm");

            //var order_id = $"{prefix}:{info.Id}:{suffix}"; // 3 компонента ИД
            //var token_str = $"{amount}{Settings.TerminalPassword}{order_id}{Settings.TerminalKey}";

            var check_args = new UrlArgs
            {
                TerminalKey = info.Terminal, // ?? Settings.TerminalKey,
                //Amount = amount,
                PaymentId = payid.ToString(), // для чеков
                //Token = .ToSHA256(),
                Receipt = new
                {
                    Phone = info.Phone, //телефон клиента
                    //Email = args.Em, //почта клиента
                    Taxation = "usn_income_outcome",
                    Payments = new {
                      Electronic = 0,
                      AdvancePayment = amount,
                    },
                    Items = new[]
                    {
                        new {
                            AgentData = new
                            {
                                AgentSign = "another"
                            },
                            SupplierInfo = new
                            {
                                Phones = info.BasePhones?.Split(',', StringSplitOptions.None) ?? new string[0],
                                Name = info.Base, //название базы
                                Inn = info.Inn //ИНН, указанный в информации о партнёской зоне
                            },
                            Name = "Бронирование творческих услуг Musbooking",
                            Price = amount, //совпадает с amount в самом начале списка параметров
                            Quantity = 1.00,
                            Amount = amount,
                            PaymentMethod = "full_payment",
                            PaymentObject = "service",
                            Tax = "none"
                        }
                    }
                }
            };

            var terminal = Settings.Terminals[info.Terminal];
            check_args.Token = check_args.GetToken(terminal.Password);

            //var res = await GetInitUrl(bargs);
            return check_args;
        }


        /// <summary>
        /// Получение ссылки на форму оплаты для Тинькова
        /// </summary>
        public static async Task<UrlRes> GetPayUrl(this UrlArgs args, PaymentMethod method)
        {
            using var web = new System.Net.WebClient();
            web
                .AddJsonContentType()
                .AddUserAgent()
                .Encode();

            var tinkoff_url = method switch
            {
                PaymentMethod.Init => Settings.InitUrl,
                PaymentMethod.Check => Settings.CheckUrl,  // bad: "https://securepay.tinkoff.ru/v2/SendClosingReceipt", https://securepay.tinkoff.ru/cashbox/SendClosingReceipt/
                _ => "",
            };
            var jsres = await web.PostJsonAsync(tinkoff_url, args);
            var res = Newtonsoft.Json.JsonConvert.DeserializeObject<UrlRes>(jsres);
            res.Args = args;

            if (!res.Success)
            {
                //WebApp.Current.Logger?.LogError($"Tinkoff error: {err}, {pureq.ReturnUrl}, {pureq.FailUrl}, {pureq.Email}, {key}, {res.ErrorCode}");
                throw new UserException($"Error tinkoff payment: [{res.ErrorCode}] {res.ErrorText} ");
            }
            return res;
        }

    }

}



#region Misc

//switch (args.Type)
//{
//    case PaymentType.Order:
//        bargs.OrderId = $"ord:{args.Id}:{suffix}";
//        break;
//    case PaymentType.Abonement:
//        bargs.OrderId = $"abn:{args.Id}:{suffix}";
//        break;
//    case PaymentType.Forfeit:
//        bargs.OrderId = $"frf:{args.Id}:{suffix}";
//        break;
//    default:
//        break;
//}

///// <summary>
///// Параметры DATA в ответе от Тинькова - не приходят, игнорятся
///// </summary>
//public class BankResConfirmData
//{
//    //public string Test { get; set; }
//    public string Client { get; set; }  // ИД клиента
//    public string Domain { get; set; }  // ИД партнера
//}
#endregion
