package com.bnppf.alphacredit.repositories.productrepository.web.rest;

import com.bnppf.alphacredit.repositories.productrepository.domain.ExpectedValue;
import com.bnppf.alphacredit.repositories.productrepository.repository.ExpectedValueRepository;
import com.bnppf.alphacredit.repositories.productrepository.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.bnppf.alphacredit.repositories.productrepository.domain.ExpectedValue}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ExpectedValueResource {

    private final Logger log = LoggerFactory.getLogger(ExpectedValueResource.class);

    private static final String ENTITY_NAME = "expectedValue";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExpectedValueRepository expectedValueRepository;

    public ExpectedValueResource(ExpectedValueRepository expectedValueRepository) {
        this.expectedValueRepository = expectedValueRepository;
    }

    /**
     * {@code POST  /expected-values} : Create a new expectedValue.
     *
     * @param expectedValue the expectedValue to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new expectedValue, or with status {@code 400 (Bad Request)} if the expectedValue has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/expected-values")
    public ResponseEntity<ExpectedValue> createExpectedValue(@RequestBody ExpectedValue expectedValue) throws URISyntaxException {
        log.debug("REST request to save ExpectedValue : {}", expectedValue);
        if (expectedValue.getId() != null) {
            throw new BadRequestAlertException("A new expectedValue cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ExpectedValue result = expectedValueRepository.save(expectedValue);
        return ResponseEntity
            .created(new URI("/api/expected-values/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /expected-values/:id} : Updates an existing expectedValue.
     *
     * @param id the id of the expectedValue to save.
     * @param expectedValue the expectedValue to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated expectedValue,
     * or with status {@code 400 (Bad Request)} if the expectedValue is not valid,
     * or with status {@code 500 (Internal Server Error)} if the expectedValue couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/expected-values/{id}")
    public ResponseEntity<ExpectedValue> updateExpectedValue(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ExpectedValue expectedValue
    ) throws URISyntaxException {
        log.debug("REST request to update ExpectedValue : {}, {}", id, expectedValue);
        if (expectedValue.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, expectedValue.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!expectedValueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ExpectedValue result = expectedValueRepository.save(expectedValue);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, expectedValue.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /expected-values/:id} : Partial updates given fields of an existing expectedValue, field will ignore if it is null
     *
     * @param id the id of the expectedValue to save.
     * @param expectedValue the expectedValue to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated expectedValue,
     * or with status {@code 400 (Bad Request)} if the expectedValue is not valid,
     * or with status {@code 404 (Not Found)} if the expectedValue is not found,
     * or with status {@code 500 (Internal Server Error)} if the expectedValue couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/expected-values/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ExpectedValue> partialUpdateExpectedValue(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ExpectedValue expectedValue
    ) throws URISyntaxException {
        log.debug("REST request to partial update ExpectedValue partially : {}, {}", id, expectedValue);
        if (expectedValue.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, expectedValue.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!expectedValueRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ExpectedValue> result = expectedValueRepository
            .findById(expectedValue.getId())
            .map(existingExpectedValue -> {
                if (expectedValue.getParameterTypeEnum() != null) {
                    existingExpectedValue.setParameterTypeEnum(expectedValue.getParameterTypeEnum());
                }
                if (expectedValue.getValue() != null) {
                    existingExpectedValue.setValue(expectedValue.getValue());
                }

                return existingExpectedValue;
            })
            .map(expectedValueRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, expectedValue.getId().toString())
        );
    }

    /**
     * {@code GET  /expected-values} : get all the expectedValues.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of expectedValues in body.
     */
    @GetMapping("/expected-values")
    public List<ExpectedValue> getAllExpectedValues() {
        log.debug("REST request to get all ExpectedValues");
        return expectedValueRepository.findAll();
    }

    /**
     * {@code GET  /expected-values/:id} : get the "id" expectedValue.
     *
     * @param id the id of the expectedValue to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the expectedValue, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/expected-values/{id}")
    public ResponseEntity<ExpectedValue> getExpectedValue(@PathVariable Long id) {
        log.debug("REST request to get ExpectedValue : {}", id);
        Optional<ExpectedValue> expectedValue = expectedValueRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(expectedValue);
    }

    /**
     * {@code DELETE  /expected-values/:id} : delete the "id" expectedValue.
     *
     * @param id the id of the expectedValue to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/expected-values/{id}")
    public ResponseEntity<Void> deleteExpectedValue(@PathVariable Long id) {
        log.debug("REST request to delete ExpectedValue : {}", id);
        expectedValueRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
