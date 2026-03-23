package com.duythuc_dh52201541.moive_ticket_infinity_cinema.controller;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.service.CloudinaryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
public class FileController {

    // Inject CloudinaryService vào controller
    private final CloudinaryService cloudinaryService;

    // Constructor injection (Spring sẽ tự tạo CloudinaryService và truyền vào)
    public FileController(CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    // API POST /upload để nhận file từ client
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        // In ra tên file nhận được để debug
        System.out.println("Received file: " + file.getOriginalFilename());
        try {
            // Gọi service để upload file lên Cloudinary
            String fileUrl = cloudinaryService.uploadFile(file);

            // Trả về URL public cho client
            return ResponseEntity.ok(fileUrl);
        } catch (Exception e) {
            // In stack trace lỗi ra console để dễ debug
            e.printStackTrace();

            // Ném RuntimeException để ExceptionHandler xử lý và trả về mã lỗi
            throw new RuntimeException("Upload failed: " + e.getMessage());
        }
    }
}


