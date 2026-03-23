package com.duythuc_dh52201541.moive_ticket_infinity_cinema.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CloudinaryService {

    // Đối tượng Cloudinary dùng để gọi API upload
    Cloudinary cloudinary;

    // Hàm upload file lên Cloudinary
    public String uploadFile(MultipartFile file) throws IOException {
        // Gọi API uploader của Cloudinary, truyền vào dữ liệu file dưới dạng byte[]
        // "resource_type": "auto" -> Cloudinary sẽ tự nhận diện loại file (ảnh, video, pdf...)
        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap("resource_type", "auto")
        );

        // Lấy ra đường dẫn URL public của file vừa upload
        return uploadResult.get("secure_url").toString();
    }
}


