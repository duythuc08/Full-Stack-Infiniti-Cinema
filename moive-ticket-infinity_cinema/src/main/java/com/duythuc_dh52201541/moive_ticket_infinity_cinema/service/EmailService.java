package com.duythuc_dh52201541.moive_ticket_infinity_cinema.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private JavaMailSender mailSender;
    private final JavaMailSender javaMailSender;

    public void sendEmail(String toEmail, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("duythuc08tt@gmail.com");
            helper.setTo(toEmail);
            helper.setSubject(subject);

            // báo cho Spring Mail biết đây là HTML content
            helper.setText(body, true);

            mailSender.send(message);
            log.info("Email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }
    public void sendEmailWithInlineImage(String to, String subject, String htmlBody, byte[] imageBytes) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true); // true để xác nhận đây là HTML

        // Đính kèm ảnh với ID là 'qrCodeImage' khớp với src="cid:qrCodeImage" trong HTML
        helper.addInline("qrCodeImage", new ByteArrayResource(imageBytes), "image/png");

        javaMailSender.send(message);
    }
}

