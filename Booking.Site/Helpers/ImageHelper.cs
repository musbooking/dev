using Microsoft.AspNetCore.Http;
using My.App;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Text;

namespace My.Utils
{
    public static class ImageHelper
    {



    }



}


#region Misc
    //public class ImageIO1111___old
    //{
    //    //private Stream streamResult = new MemoryStream();

    //    public Stream ResizeImageStream(IFormFile ffile)
    //    {
    //        var stream = new MemoryStream();
    //        using (var image = Image.FromStream(ffile.OpenReadStream()))
    //        {
    //            var newimage = Itall.Drawing.GraphicUtils.ResizeImage(image, 800, 800);
    //            image.Save(stream, ImageFormat.Jpeg);
    //            image.Dispose();
    //        }
    //        return stream;

    //        //int width = 128;
    //        //int height = 128;
    //        //var file = file0.FileName;
    //        //Console.WriteLine($"Loading {file}");
    //        //using var pngStream = new FileStream(file, FileMode.Open, FileAccess.Read);
    //        //using var image = new Bitmap(pngStream);

    //        //var resized = new Bitmap(width, height);
    //        //using var graphics = Graphics.FromImage(resized);
    //        //graphics.CompositingQuality = CompositingQuality.HighSpeed;
    //        //graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
    //        //graphics.CompositingMode = CompositingMode.SourceCopy;
    //        //graphics.DrawImage(image, 0, 0, width, height);
    //        //resized.Save($"resized-{file}", ImageFormat.Png);
    //        //Console.WriteLine($"Saving resized-{file} thumbnail");
    //        //return 
    //    }


    //    public Stream ResizeImageStream1(IFormFile file)
    //    {
    //        // Stream imageStream = new MemoryStream();
    //        var imageStream = file.OpenReadStream();

    //        double scaleFactor = 1;
    //        while (imageStream.Length / 1024 > 500)
    //        {
    //            var image = Image.FromStream(imageStream);

    //            var newWidth = (int)(image.Width * scaleFactor);
    //            var newHeight = (int)(image.Height * scaleFactor);

    //            var thumbnailBitmap = new Bitmap(newWidth, newHeight);

    //            var hr = image.HorizontalResolution < 10 || image.HorizontalResolution > 150 ? 72 : image.HorizontalResolution;
    //            var vr = image.VerticalResolution < 10 || image.VerticalResolution > 150 ? 72 : image.VerticalResolution;
    //            thumbnailBitmap.SetResolution(hr, vr);

    //            var thumbnailGraph = Graphics.FromImage(thumbnailBitmap);

    //            thumbnailGraph.CompositingQuality = CompositingQuality.HighQuality;
    //            thumbnailGraph.SmoothingMode = SmoothingMode.HighQuality;
    //            thumbnailGraph.InterpolationMode = InterpolationMode.HighQualityBicubic;
    //            thumbnailGraph.CompositingMode = CompositingMode.SourceCopy;

    //            var imageRectangle = new Rectangle(0, 0, newWidth, newHeight);

    //            var blueBrush = new SolidBrush(Color.White);
    //            thumbnailGraph.FillRectangle(blueBrush, imageRectangle);

    //            thumbnailGraph.DrawImage(image, imageRectangle);

    //            imageStream.Dispose();
    //            imageStream = new MemoryStream();
    //            thumbnailBitmap.Save(imageStream, ImageFormat.Jpeg);

    //            scaleFactor -= 0.1;
    //            thumbnailGraph.Dispose();
    //            thumbnailBitmap.Dispose();
    //            image.Dispose();
    //        }

    //        return imageStream;
    //    }

    //    //public void Dispose()
    //    //{
    //    //    if (streamResult != null) streamResult.Dispose();
    //    //}

    //}
#endregion

