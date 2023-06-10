package com.bnppf.alphacredit.creditproductdesigner.web.rest;

import com.bnppf.alphacredit.creditproductdesigner.domain.BusinessModel;
import com.bnppf.alphacredit.creditproductdesigner.repository.BusinessModelRepository;
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
 * REST controller for managing {@link com.bnppf.alphacredit.creditproductdesigner.domain.BusinessModel}.
 */
@RestController
@RequestMapping("/api")
public class BusinessModelResource {

    private final Logger log = LoggerFactory.getLogger(BusinessModelResource.class);

    private static final String ENTITY_NAME = "businessModel";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BusinessModelRepository businessModelRepository;

    public BusinessModelResource(BusinessModelRepository businessModelRepository) {
        this.businessModelRepository = businessModelRepository;
    }

    /**
     * {@code POST  /business-models} : Create a new businessModel.
     *
     * @param businessModel the businessModel to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new businessModel, or with status {@code 400 (Bad Request)} if the businessModel has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/business-models")
    public Mono<ResponseEntity<BusinessModel>> createBusinessModel(@Valid @RequestBody BusinessModel businessModel)
        throws URISyntaxException {
        log.debug("REST request to save BusinessModel : {}", businessModel);
        if (businessModel.getId() != null) {
            throw new BadRequestAlertException("A new businessModel cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return businessModelRepository
            .save(businessModel)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/business-models/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /business-models/:id} : Updates an existing businessModel.
     *
     * @param id the id of the businessModel to save.
     * @param businessModel the businessModel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated businessModel,
     * or with status {@code 400 (Bad Request)} if the businessModel is not valid,
     * or with status {@code 500 (Internal Server Error)} if the businessModel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/business-models/{id}")
    public Mono<ResponseEntity<BusinessModel>> updateBusinessModel(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody BusinessModel businessModel
    ) throws URISyntaxException {
        log.debug("REST request to update BusinessModel : {}, {}", id, businessModel);
        if (businessModel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, businessModel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return businessModelRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return businessModelRepository
                    .save(businessModel)
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
     * {@code PATCH  /business-models/:id} : Partial updates given fields of an existing businessModel, field will ignore if it is null
     *
     * @param id the id of the businessModel to save.
     * @param businessModel the businessModel to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated businessModel,
     * or with status {@code 400 (Bad Request)} if the businessModel is not valid,
     * or with status {@code 404 (Not Found)} if the businessModel is not found,
     * or with status {@code 500 (Internal Server Error)} if the businessModel couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/business-models/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<BusinessModel>> partialUpdateBusinessModel(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody BusinessModel businessModel
    ) throws URISyntaxException {
        log.debug("REST request to partial update BusinessModel partially : {}, {}", id, businessModel);
        if (businessModel.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, businessModel.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return businessModelRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<BusinessModel> result = businessModelRepository
                    .findById(businessModel.getId())
                    .map(existingBusinessModel -> {
                        if (businessModel.getName() != null) {
                            existingBusinessModel.setName(businessModel.getName());
                        }
                        if (businessModel.getType() != null) {
                            existingBusinessModel.setType(businessModel.getType());
                        }
                        if (businessModel.getCategory() != null) {
                            existingBusinessModel.setCategory(businessModel.getCategory());
                        }

                        return existingBusinessModel;
                    })
                    .flatMap(businessModelRepository::save);

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
     * {@code GET  /business-models} : get all the businessModels.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of businessModels in body.
     */
    @GetMapping("/business-models")
    public Mono<List<BusinessModel>> getAllBusinessModels() {
        log.debug("REST request to get all BusinessModels");
        return businessModelRepository.findAll().collectList();
    }

    /**
     * {@code GET  /business-models} : get all the businessModels as a stream.
     * @return the {@link Flux} of businessModels.
     */
    @GetMapping(value = "/business-models", produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<BusinessModel> getAllBusinessModelsAsStream() {
        log.debug("REST request to get all BusinessModels as a stream");
        return businessModelRepository.findAll();
    }

    /**
     * {@code GET  /business-models/:id} : get the "id" businessModel.
     *
     * @param id the id of the businessModel to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the businessModel, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/business-models/{id}")
    public Mono<ResponseEntity<BusinessModel>> getBusinessModel(@PathVariable String id) {
        log.debug("REST request to get BusinessModel : {}", id);
        Mono<BusinessModel> businessModel = businessModelRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(businessModel);
    }

    /**
     * {@code DELETE  /business-models/:id} : delete the "id" businessModel.
     *
     * @param id the id of the businessModel to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/business-models/{id}")
    public Mono<ResponseEntity<Void>> deleteBusinessModel(@PathVariable String id) {
        log.debug("REST request to delete BusinessModel : {}", id);
        return businessModelRepository
            .deleteById(id)
            .then(
                Mono.just(
                    ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build()
                )
            );
    }
}
