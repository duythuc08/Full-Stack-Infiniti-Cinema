package com.duythuc_dh52201541.moive_ticket_infinity_cinema.utils;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
public class QRCodeUtils {
    // Hàm này nhận vào text và trả về chuỗi Base64 của ảnh QR
    // Frontend chỉ cần gán vào thẻ <img src="data:image/png;base64,..."/>
    public String generateQRCodeImage(String barcodeText, int width, int height) {
        try {
            QRCodeWriter barcodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = barcodeWriter.encode(barcodeText, BarcodeFormat.QR_CODE, width, height);

            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", bos);

            byte[] imageBytes = bos.toByteArray();
            return Base64.getEncoder().encodeToString(imageBytes);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo QR Code: " + e.getMessage());
        }
    }
}
