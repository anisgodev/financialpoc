package com.bnppf.alphacredit.creditproductdesigner.web.rest;

import com.bnppf.alphacredit.creditproductdesigner.domain.BusinessRuleCondition;
import com.bnppf.alphacredit.creditproductdesigner.repository.BusinessRuleConditionRepository;
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
 * REST controller for managing {@link com.bnppf.alphacredit.creditproductdesigner.domain.BusinessRuleCondition}.
 */
@RestController
@RequestMapping("/api")
public class BusinessRuleConditionResource {

    private final Logger log = LoggerFactory.getLogger(BusinessRuleConditionResource.class);

    private static final String ENTITY_NAME = "businessRuleCondition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BusinessRuleConditionRepository businessRuleConditionRepository;

    public BusinessRuleConditionResource(BusinessRuleConditionRepository businessRuleConditionRepository) {
        this.businessRuleConditionRepository = businessRuleConditionRepository;
    }

    /**
     * {@code POST  /business-rule-conditions} : Create a new businessRuleCondition.
     *
     * @param businessRuleCondition the businessRuleCondition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new businessRuleCondition, or with status {@code 400 (Bad Request)} if the businessRuleCondition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/business-rule-conditions")
    public Mono<ResponseEntity<BusinessRuleCondition>> createBusinessRuleCondition(
        @Valid @RequestBody BusinessRuleCondition businessRuleCondition
    ) throws URISyntaxException {
        log.debug("REST request to save BusinessRuleCondition : {}", businessRuleCondition);
        if (businessRuleCondition.getId() != null) {
            throw new BadRequestAlertException("A new businessRuleCondition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return businessRuleConditionRepository
            .save(businessRuleCondition)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/business-rule-conditions/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /business-rule-conditions/:id} : Updates an existing businessRuleCondition.
     *
     * @param id the id of the businessRuleCondition to save.
     * @param businessRuleCondition the businessRuleCondition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated businessRuleCondition,
     * or with status {@code 400 (Bad Request)} if the businessRuleCondition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the businessRuleCondition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/business-rule-conditions/{id}")
    public Mono<ResponseEntity<BusinessRuleCondition>> updateBusinessRuleCondition(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody BusinessRuleCondition businessRuleCondition
    ) throws URISyntaxException {
        log.debug("REST request to update BusinessRuleCondition : {}, {}", id, businessRuleCondition);
        if (businessRuleCondition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, businessRuleCondition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return businessRuleConditionRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return businessRuleConditionRepository
                    .save(businessRuleCondition)
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
     * {@code PATCH  /business-rule-conditions/:id} : Partial updates given fields of an existing businessRuleCondition, field will ignore if it is null
     *
     * @param id the id of the businessRuleCondition to save.
     * @param businessRuleCondition the businessRuleCondition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated businessRuleCondition,
     * or with status {@code 400 (Bad Request)} if the businessRuleCondition is not valid,
     * or with status {@code 404 (Not Found)} if the businessRuleCondition is not found,
     * or with status {@code 500 (Internal Server Error)} if the businessRuleCondition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/business-rule-conditions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<BusinessRuleCondition>> partialUpdateBusinessRuleCondition(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody BusinessRuleCondition businessRuleCondition
    ) throws URISyntaxException {
        log.debug("REST request to partial update BusinessRuleCondition partially : {}, {}", id, businessRuleCondition);
        if (businessRuleCondition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, businessRuleCondition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return businessRuleConditionRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<BusinessRuleCondition> result = businessRuleConditionRepository
                    .findById(businessRuleCondition.getId())
                    .map(existingBusinessRuleCondition -> {
                        if (businessRuleCondition.getField() != null) {
                            existingBusinessRuleCondition.setField(businessRuleCondition.getField());
                        }
                        if (businessRuleCondition.getValue() != null) {
                            existingBusinessRuleCondition.setValue(businessRuleCondition.getValue());
                        }
                        if (businessRuleCondition.getOperator() != null) {
                            existingBusinessRuleCondition.setOperator(businessRuleCondition.getOperator());
                        }

                        return existingBusinessRuleCondition;
                    })
                    .flatMap(businessRuleConditionRepository::save);

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
     * {@code GET  /business-rule-conditions} : get all the businessRuleConditions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of businessRuleConditions in body.
     */
    @GetMapping("/business-rule-conditions")
    public Mono<List<BusinessRuleCondition>> getAllBusinessRuleConditions() {
        log.debug("REST request to get all BusinessRuleConditions");
        return businessRuleConditionRepository.findAll().collectList();
    }

    /**
     * {@code GET  /business-rule-conditions} : get all the businessRuleConditions as a stream.
     * @return the {@link Flux} of businessRuleConditions.
     */
    @GetMapping(value = "/business-rule-conditions", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<BusinessRuleCondition> getAllBusinessRuleConditionsAsStream() {
        log.debug("REST request to get all BusinessRuleConditions as a stream");
        return businessRuleConditionRepository.findAll();
    }

    /**
     * {@code GET  /business-rule-conditions/:id} : get the "id" businessRuleCondition.
     *
     * @param id the id of the businessRuleCondition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the businessRuleCondition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/business-rule-conditions/{id}")
    public Mono<ResponseEntity<BusinessRuleCondition>> getBusinessRuleCondition(@PathVariable String id) {
        log.debug("REST request to get BusinessRuleCondition : {}", id);
        Mono<BusinessRuleCondition> businessRuleCondition = businessRuleConditionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(businessRuleCondition);
    }

    /**
     * {@code DELETE  /business-rule-conditions/:id} : delete the "id" businessRuleCondition.
     *
     * @param id the id of the businessRuleCondition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/business-rule-conditions/{id}")
    public Mono<ResponseEntity<Void>> deleteBusinessRuleCondition(@PathVariable String id) {
        log.debug("REST request to delete BusinessRuleCondition : {}", id);
        return businessRuleConditionRepository
            .deleteById(id)
            .then(
                Mono.just(
                    ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build()
                )
            );
    }
}
