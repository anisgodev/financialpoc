import org.junit.jupiter.api.Test;
import reactor.core.publisher.Flux;

public class FluxText {

    @Test
    public void firstFlux(){
        Flux.just("A","B","C")
            .log()
            .subscribe();
    }
}
