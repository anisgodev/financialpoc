package com.bnppf.alphacredit.creditproductdesigner.web.rest;

import com.bnppf.alphacredit.creditproductdesigner.domain.CreditProductInstance;
import com.bnppf.alphacredit.creditproductdesigner.repository.CreditProductInstanceRepository;
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
 * REST controller for managing {@link com.bnppf.alphacredit.creditproductdesigner.domain.CreditProductInstance}.
 */
@RestController
@RequestMapping("/api")
public class CreditProductInstanceResource {

    private final Logger log = LoggerFactory.getLogger(CreditProductInstanceResource.class);

    private static final String ENTITY_NAME = "creditProductInstance";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CreditProductInstanceRepository creditProductInstanceRepository;

    public CreditProductInstanceResource(CreditProductInstanceRepository creditProductInstanceRepository) {
        this.creditProductInstanceRepository = creditProductInstanceRepository;
    }

    /**
     * {@code POST  /credit-product-instances} : Create a new creditProductInstance.
     *
     * @param creditProductInstance the creditProductInstance to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new creditProductInstance, or with status {@code 400 (Bad Request)} if the creditProductInstance has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/credit-product-instances")
    public Mono<ResponseEntity<CreditProductInstance>> createCreditProductInstance(
        @Valid @RequestBody CreditProductInstance creditProductInstance
    ) throws URISyntaxException {
        log.debug("REST request to save CreditProductInstance : {}", creditProductInstance);
        if (creditProductInstance.getId() != null) {
            throw new BadRequestAlertException("A new creditProductInstance cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return creditProductInstanceRepository
            .save(creditProductInstance)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/credit-product-instances/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /credit-product-instances/:id} : Updates an existing creditProductInstance.
     *
     * @param id the id of the creditProductInstance to save.
     * @param creditProductInstance the creditProductInstance to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated creditProductInstance,
     * or with status {@code 400 (Bad Request)} if the creditProductInstance is not valid,
     * or with status {@code 500 (Internal Server Error)} if the creditProductInstance couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/credit-product-instances/{id}")
    public Mono<ResponseEntity<CreditProductInstance>> updateCreditProductInstance(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody CreditProductInstance creditProductInstance
    ) throws URISyntaxException {
        log.debug("REST request to update CreditProductInstance : {}, {}", id, creditProductInstance);
        if (creditProductInstance.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, creditProductInstance.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return creditProductInstanceRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return creditProductInstanceRepository
                    .save(creditProductInstance)
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
     * {@code PATCH  /credit-product-instances/:id} : Partial updates given fields of an existing creditProductInstance, field will ignore if it is null
     *
     * @param id the id of the creditProductInstance to save.
     * @param creditProductInstance the creditProductInstance to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated creditProductInstance,
     * or with status {@code 400 (Bad Request)} if the creditProductInstance is not valid,
     * or with status {@code 404 (Not Found)} if the creditProductInstance is not found,
     * or with status {@code 500 (Internal Server Error)} if the creditProductInstance couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/credit-product-instances/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<CreditProductInstance>> partialUpdateCreditProductInstance(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody CreditProductInstance creditProductInstance
    ) throws URISyntaxException {
        log.debug("REST request to partial update CreditProductInstance partially : {}, {}", id, creditProductInstance);
        if (creditProductInstance.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, creditProductInstance.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return creditProductInstanceRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<CreditProductInstance> result = creditProductInstanceRepository
                    .findById(creditProductInstance.getId())
                    .map(existingCreditProductInstance -> {
                        if (creditProductInstance.getName() != null) {
                            existingCreditProductInstance.setName(creditProductInstance.getName());
                        }

                        return existingCreditProductInstance;
                    })
                    .flatMap(creditProductInstanceRepository::save);

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
     * {@code GET  /credit-product-instances} : get all the creditProductInstances.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of creditProductInstances in body.
     */
    @GetMapping("/credit-product-instances")
    public Mono<List<CreditProductInstance>> getAllCreditProductInstances() {
        log.debug("REST request to get all CreditProductInstances");
        return creditProductInstanceRepository.findAll().collectList();
    }

    /**
     * {@code GET  /credit-product-instances} : get all the creditProductInstances as a stream.
     * @return the {@link Flux} of creditProductInstances.
     */
    @GetMapping(value = "/credit-product-instances", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<CreditProductInstance> getAllCreditProductInstancesAsStream() {
        log.debug("REST request to get all CreditProductInstances as a stream");
        return creditProductInstanceRepository.findAll();
    }

    /**
     * {@code GET  /credit-product-instances/:id} : get the "id" creditProductInstance.
     *
     * @param id the id of the creditProductInstance to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the creditProductInstance, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/credit-product-instances/{id}")
    public Mono<ResponseEntity<CreditProductInstance>> getCreditProductInstance(@PathVariable String id) {
        log.debug("REST request to get CreditProductInstance : {}", id);
        Mono<CreditProductInstance> creditProductInstance = creditProductInstanceRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(creditProductInstance);
    }

    /**
     * {@code DELETE  /credit-product-instances/:id} : delete the "id" creditProductInstance.
     *
     * @param id the id of the creditProductInstance to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/credit-product-instances/{id}")
    public Mono<ResponseEntity<Void>> deleteCreditProductInstance(@PathVariable String id) {
        log.debug("REST request to delete CreditProductInstance : {}", id);
        return creditProductInstanceRepository
            .deleteById(id)
            .then(
                Mono.just(
                    ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build()
                )
            );
    }
}
