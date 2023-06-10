package com.bnppf.alphacredit.creditproductdesigner.web.rest;

import com.bnppf.alphacredit.creditproductdesigner.domain.BusinessRule;
import com.bnppf.alphacredit.creditproductdesigner.repository.BusinessRuleRepository;
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
 * REST controller for managing {@link com.bnppf.alphacredit.creditproductdesigner.domain.BusinessRule}.
 */
@RestController
@RequestMapping("/api")
public class BusinessRuleResource {

    private final Logger log = LoggerFactory.getLogger(BusinessRuleResource.class);

    private static final String ENTITY_NAME = "businessRule";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BusinessRuleRepository businessRuleRepository;

    public BusinessRuleResource(BusinessRuleRepository businessRuleRepository) {
        this.businessRuleRepository = businessRuleRepository;
    }

    /**
     * {@code POST  /business-rules} : Create a new businessRule.
     *
     * @param businessRule the businessRule to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new businessRule, or with status {@code 400 (Bad Request)} if the businessRule has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/business-rules")
    public Mono<ResponseEntity<BusinessRule>> createBusinessRule(@Valid @RequestBody BusinessRule businessRule) throws URISyntaxException {
        log.debug("REST request to save BusinessRule : {}", businessRule);
        if (businessRule.getId() != null) {
            throw new BadRequestAlertException("A new businessRule cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return businessRuleRepository
            .save(businessRule)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/business-rules/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /business-rules/:id} : Updates an existing businessRule.
     *
     * @param id the id of the businessRule to save.
     * @param businessRule the businessRule to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated businessRule,
     * or with status {@code 400 (Bad Request)} if the businessRule is not valid,
     * or with status {@code 500 (Internal Server Error)} if the businessRule couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/business-rules/{id}")
    public Mono<ResponseEntity<BusinessRule>> updateBusinessRule(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody BusinessRule businessRule
    ) throws URISyntaxException {
        log.debug("REST request to update BusinessRule : {}, {}", id, businessRule);
        if (businessRule.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, businessRule.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return businessRuleRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return businessRuleRepository
                    .save(businessRule)
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
     * {@code PATCH  /business-rules/:id} : Partial updates given fields of an existing businessRule, field will ignore if it is null
     *
     * @param id the id of the businessRule to save.
     * @param businessRule the businessRule to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated businessRule,
     * or with status {@code 400 (Bad Request)} if the businessRule is not valid,
     * or with status {@code 404 (Not Found)} if the businessRule is not found,
     * or with status {@code 500 (Internal Server Error)} if the businessRule couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/business-rules/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<BusinessRule>> partialUpdateBusinessRule(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody BusinessRule businessRule
    ) throws URISyntaxException {
        log.debug("REST request to partial update BusinessRule partially : {}, {}", id, businessRule);
        if (businessRule.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, businessRule.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return businessRuleRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<BusinessRule> result = businessRuleRepository
                    .findById(businessRule.getId())
                    .map(existingBusinessRule -> {
                        if (businessRule.getName() != null) {
                            existingBusinessRule.setName(businessRule.getName());
                        }
                        if (businessRule.getBusinessProcess() != null) {
                            existingBusinessRule.setBusinessProcess(businessRule.getBusinessProcess());
                        }

                        return existingBusinessRule;
                    })
                    .flatMap(businessRuleRepository::save);

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
     * {@code GET  /business-rules} : get all the businessRules.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of businessRules in body.
     */
    @GetMapping("/business-rules")
    public Mono<List<BusinessRule>> getAllBusinessRules() {
        log.debug("REST request to get all BusinessRules");
        return businessRuleRepository.findAll().collectList();
    }

    /**
     * {@code GET  /business-rules} : get all the businessRules as a stream.
     * @return the {@link Flux} of businessRules.
     */
    @GetMapping(value = "/business-rules", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<BusinessRule> getAllBusinessRulesAsStream() {
        log.debug("REST request to get all BusinessRules as a stream");
        return businessRuleRepository.findAll();
    }

    /**
     * {@code GET  /business-rules/:id} : get the "id" businessRule.
     *
     * @param id the id of the businessRule to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the businessRule, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/business-rules/{id}")
    public Mono<ResponseEntity<BusinessRule>> getBusinessRule(@PathVariable String id) {
        log.debug("REST request to get BusinessRule : {}", id);
        Mono<BusinessRule> businessRule = businessRuleRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(businessRule);
    }

    /**
     * {@code DELETE  /business-rules/:id} : delete the "id" businessRule.
     *
     * @param id the id of the businessRule to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/business-rules/{id}")
    public Mono<ResponseEntity<Void>> deleteBusinessRule(@PathVariable String id) {
        log.debug("REST request to delete BusinessRule : {}", id);
        return businessRuleRepository
            .deleteById(id)
            .then(
                Mono.just(
                    ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build()
                )
            );
    }
}
