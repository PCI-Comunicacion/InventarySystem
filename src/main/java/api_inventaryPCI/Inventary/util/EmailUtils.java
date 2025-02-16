package api_inventaryPCI.Inventary.util;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailUtils {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendSimpleMessage(String to, String subject, String text, List<String> list) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("soporteprontacomunicacion@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        if(list != null && list.size() > 0){
                message.setCc(getCcArray(list));
        }
        javaMailSender.send(message);
    }

    private String[] getCcArray(List<String> cclist){
        String[] ccArray = new String[cclist.size()];
        for(int i = 0; i < cclist.size(); i++){
            ccArray[i] = cclist.get(i);
        }
        return ccArray;
    }

    public void forgotPassword(String to, String subject, String password){
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("soporteprontacomunicacion@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);
            String htmlMessage =
                    "<p><h2> Has solicitado recuperar la contrase&ntilde;a de tu cuenta. A continuaci&oacute;n, encontrar&aacute;s tu contrase&ntilde;a actual:</h2></p>" +
                    "<p>Contrase&ntilde;a: <strong>" + password + "</strong></p>" +
                    "<p>Si no realizaste esta solicitud, te recomendamos que te pongas en contacto con nuestro equipo de soporte lo antes posible.</p>" +
                    "<p><strong>PCI Pronta Comunicaci&oacute;n.</strong></p>";
            message.setContent(htmlMessage, "text/html");

            javaMailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
