using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace My.App
{

    /// <summary>
    /// Usage in startup.cs:
    ///                 app.UseWebSockets();
    ///                 app.UseMiddleware<App.WebSocketMiddleware>();
    /// </summary>
    public class WebSocketMiddleware
    {

        private readonly RequestDelegate _next;

        public WebSocketMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {

            if (!context.WebSockets.IsWebSocketRequest)
            {
                await _next(context);
                //context.Response.StatusCode = 400;
                //await context.Response.WriteAsync("This endpoint accepts only websocket connections.");
                return;
            }

            // извлекаем код, по которому найдем менеджера
            var sh_managers_keys = context.Request.Path.Value?.Substring(1) ?? "default";
            var managers_keys = sh_managers_keys.Split("/");
            var manager_key = managers_keys[0];
            var manager = WebSocketManager.GetManager(manager_key);
            var socket = await context.WebSockets.AcceptWebSocketAsync();

            string key = managers_keys.Length>1 ?managers_keys[1] :"";   //context.Request.Query["key"]; //  ?? context.Request.Query["id"];
            manager.AddWebSocket(socket, key);
            

            //WebApp.Current.Logger.Log()

#if !DEBUG1 // пока всегда
            // на реальном веб-сервере все нормально отрабатывается, проблема только локально
            // поэтому зацикливаем для отладки
            while (socket.State == WebSocketState.Open)
            {
                await Task.Delay(50000);
                //System.Diagnostics.Debug.WriteLine($"socket restarted: {tt++} > {socket.GetHashCode()} ");
            }
            // await Task.Delay(145*1000); // после смерти коннекта пробуем продержаться еще - не взлетело
#endif
        }

        //public static int OpenedConnections = 0;
        //public static StringBui
    }

    /// <summary>
    /// Container for sockets
    /// </summary>
    public class WebSocketManager
    {
        /// <summary>
        /// Get Manager by some group key
        /// </summary>
        public static WebSocketManager GetManager(string manager_key)
        {
            lock (_Managers)
            {
                _Managers.TryGetValue(manager_key, out var manager);
                if (manager == null)
                {
                    manager = new WebSocketManager();
                    _Managers[manager_key] = manager;
                }
                return manager;
            }
        }

        private static Dictionary<string, WebSocketManager> _Managers = new Dictionary<string, WebSocketManager>();
        private readonly ConcurrentDictionary<string, WebSocket> _sockets = new ConcurrentDictionary<string, WebSocket>();

        WebSocketManager()
        {
        }

        static int _N = 0;
        public string AddWebSocket(WebSocket socket, string id)
        {
            //var guid = Guid.NewGuid();
            _sockets.TryAdd(id + ++_N, socket);
            return id;
        }


        public async Task SendAsync(string key, object obj)
        {
            var sockets = _sockets.AsEnumerable();

            if (!string.IsNullOrWhiteSpace(key))
                sockets = sockets.Where(x => x.Key.StartsWith(key));

            foreach (var socket in sockets)
            {
                if (socket.Value.State == WebSocketState.Open)
                    await sendMessageAsync(socket.Value, obj);
                else
                    await removeWebSocketAsync(socket.Key);
            }
        }

        static Newtonsoft.Json.JsonSerializerSettings _settings =
                new Newtonsoft.Json.JsonSerializerSettings
                {
                    ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()
                };

        private async Task sendMessageAsync(WebSocket socket, object obj)
        {
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj, _settings);

            await socket.SendAsync(
                new ArraySegment<byte>(Encoding.UTF8.GetBytes(json)),
                WebSocketMessageType.Text,
                true,
                CancellationToken.None);
        }

        private async Task removeWebSocketAsync(string id)
        {
            if (!_sockets.TryRemove(id, out var socket))
                return;

            if (socket?.State == WebSocketState.Open)
                await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);

            socket.Dispose();
        }
    }
}



#region Misc


//await socket.SendAsync(
//    new ArraySegment<byte>(Encoding.UTF8.GetBytes("test socket")),
//    WebSocketMessageType.Text,
//    true,
//    CancellationToken.None
//    //CancellationToken.None
//    //default(CancellationToken)
//    );
////var g = Guid.NewGuid();


// this call succeeds
//await manager.SendAsync(id, "connected ok");

//public async Task SendAsync(string id, object obj)
//{
//    if (!_sockets.TryGetValue(id, out var socket))
//        return;

//    await SendMessageAsync(socket, obj);
//}

#endregion
