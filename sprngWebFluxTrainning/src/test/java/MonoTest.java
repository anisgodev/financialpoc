import org.junit.jupiter.api.Test;
import reactor.core.publisher.Mono;

public class MonoTest {

    @Test
    void firstMono(){
        Mono.just("A");
    }

    @Test
    void monoWithConsumer(){
        Mono.just("A")
            .log().subscribe(System.out::println);
    }

    @Test
    void monoWithDoOn(){
        Mono.just("A")
            .doOnSubscribe(System.out::println)
            .doOnRequest(System.out::println)
            .doOnSuccess(System.out::println)
            .log().subscribe(System.out::println);
    }

    @Test
    void emptyMono(){
        Mono.empty()
            .log().subscribe(System.out::println);
    }

    @Test
    void emptyCompleteConsumer(){
        Mono.empty()
            .log()
            .subscribe(System.out::println,
                null,
                ()-> System.out.println("Done"));
    }

    @Test
    void errorRuntimeExceptionMono(){
        Mono.error(new RuntimeException())
            .log()
            .subscribe();
    }


}
