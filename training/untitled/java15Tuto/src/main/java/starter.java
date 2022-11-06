import java.math.BigDecimal;

public class starter {

    public static void main(String[] args) {
        System.out.println("start the app");
        BigDecimal x = BigDecimal.valueOf(10.12339);
        if(x instanceof BigDecimal b){
            b.precision();
            System.out.println(b.precision());
        }

    }
}
