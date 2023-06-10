package com.bnppf.alphacredit.creditproductdesigner.web.rest;

import com.bnppf.alphacredit.creditproductdesigner.domain.CreditProduct;
import com.bnppf.alphacredit.creditproductdesigner.repository.CreditProductRepository;
import com.bnppf.alphacredit.creditproductdesigner.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.reactive.ResponseUtil;

/**
 * REST controller for managing {@link com.bnppf.alphacredit.creditproductdesigner.domain.CreditProduct}.
 */
@RestController
@RequestMapping("/api")
public class CreditProductResource {

    private final Logger log = LoggerFactory.getLogger(CreditProductResource.class);

    private static final String ENTITY_NAME = "creditProduct";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CreditProductRepository creditProductRepository;

    public CreditProductResource(CreditProductRepository creditProductRepository) {
        this.creditProductRepository = creditProductRepository;
    }

    /**
     * {@code POST  /credit-products} : Create a new creditProduct.
     *
     * @param creditProduct the creditProduct to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new creditProduct, or with status {@code 400 (Bad Request)} if the creditProduct has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/credit-products")
    public Mono<ResponseEntity<CreditProduct>> createCreditProduct(@Valid @RequestBody CreditProduct creditProduct)
        throws URISyntaxException {
        log.debug("REST request to save CreditProduct : {}", creditProduct);
        if (creditProduct.getId() != null) {
            throw new BadRequestAlertException("A new creditProduct cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return creditProductRepository
            .save(creditProduct)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/credit-products/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /credit-products/:id} : Updates an existing creditProduct.
     *
     * @param id the id of the creditProduct to save.
     * @param creditProduct the creditProduct to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated creditProduct,
     * or with status {@code 400 (Bad Request)} if the creditProduct is not valid,
     * or with status {@code 500 (Internal Server Error)} if the creditProduct couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/credit-products/{id}")
    public Mono<ResponseEntity<CreditProduct>> updateCreditProduct(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody CreditProduct creditProduct
    ) throws URISyntaxException {
        log.debug("REST request to update CreditProduct : {}, {}", id, creditProduct);
        if (creditProduct.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, creditProduct.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return creditProductRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return creditProductRepository
                    .save(creditProduct)
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(result ->
                        ResponseEntity
                            .ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, result.getId()))
                            .body(result)
                    );
            });
    }

    /**
     * {@code PATCH  /credit-products/:id} : Partial updates given fields of an existing creditProduct, field will ignore if it is null
     *
     * @param id the id of the creditProduct to save.
     * @param creditProduct the creditProduct to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated creditProduct,
     * or with status {@code 400 (Bad Request)} if the creditProduct is not valid,
     * or with status {@code 404 (Not Found)} if the creditProduct is not found,
     * or with status {@code 500 (Internal Server Error)} if the creditProduct couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/credit-products/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<CreditProduct>> partialUpdateCreditProduct(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody CreditProduct creditProduct
    ) throws URISyntaxException {
        log.debug("REST request to partial update CreditProduct partially : {}, {}", id, creditProduct);
        if (creditProduct.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, creditProduct.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return creditProductRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<CreditProduct> result = creditProductRepository
                    .findById(creditProduct.getId())
                    .map(existingCreditProduct -> {
                        if (creditProduct.getName() != null) {
                            existingCreditProduct.setName(creditProduct.getName());
                        }

                        return existingCreditProduct;
                    })
                    .flatMap(creditProductRepository::save);

                return result
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(res ->
                        ResponseEntity
                            .ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, res.getId()))
                            .body(res)
                    );
            });
    }

    /**
     * {@code GET  /credit-products} : get all the creditProducts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of creditProducts in body.
     */
    @GetMapping("/credit-products")
    public Mono<List<CreditProduct>> getAllCreditProducts() {
        log.debug("REST request to get all CreditProducts");
        return creditProductRepository.findAll().collectList();
    }

    /**
     * {@code GET  /credit-products} : get all the creditProducts as a stream.
     * @return the {@link Flux} of creditProducts.
     */
    @GetMapping(value = "/credit-products", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<CreditProduct> getAllCreditProductsAsStream() {
        log.debug("REST request to get all CreditProducts as a stream");
        return creditProductRepository.findAll();
    }

    /**
     * {@code GET  /credit-products/:id} : get the "id" creditProduct.
     *
     * @param id the id of the creditProduct to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the creditProduct, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/credit-products/{id}")
    public Mono<ResponseEntity<CreditProduct>> getCreditProduct(@PathVariable String id) {
        log.debug("REST request to get CreditProduct : {}", id);
        Mono<CreditProduct> creditProduct = creditProductRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(creditProduct);
    }

    /**
     * {@code DELETE  /credit-products/:id} : delete the "id" creditProduct.
     *
     * @param id the id of the creditProduct to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/credit-products/{id}")
    public Mono<ResponseEntity<Void>> deleteCreditProduct(@PathVariable String id) {
        log.debug("REST request to delete CreditProduct : {}", id);
        return creditProductRepository
            .deleteById(id)
            .then(
                Mono.just(
                    ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build()
                )
            );
    }
}
