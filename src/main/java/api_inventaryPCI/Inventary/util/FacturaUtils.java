package api_inventaryPCI.Inventary.util;

import java.text.SimpleDateFormat;
import java.util.Date;

public class FacturaUtils {

    private FacturaUtils(){}

    public static Date getDateFromString(String date) {
        try {
            return new SimpleDateFormat("yyyy-MM-dd").parse(date);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
