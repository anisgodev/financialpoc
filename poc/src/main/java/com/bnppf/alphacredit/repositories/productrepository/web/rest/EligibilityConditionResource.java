package com.bnppf.alphacredit.repositories.productrepository.web.rest;

import com.bnppf.alphacredit.repositories.productrepository.domain.EligibilityCondition;
import com.bnppf.alphacredit.repositories.productrepository.repository.EligibilityConditionRepository;
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
 * REST controller for managing {@link com.bnppf.alphacredit.repositories.productrepository.domain.EligibilityCondition}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EligibilityConditionResource {

    private final Logger log = LoggerFactory.getLogger(EligibilityConditionResource.class);

    private static final String ENTITY_NAME = "eligibilityCondition";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EligibilityConditionRepository eligibilityConditionRepository;

    public EligibilityConditionResource(EligibilityConditionRepository eligibilityConditionRepository) {
        this.eligibilityConditionRepository = eligibilityConditionRepository;
    }

    /**
     * {@code POST  /eligibility-conditions} : Create a new eligibilityCondition.
     *
     * @param eligibilityCondition the eligibilityCondition to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new eligibilityCondition, or with status {@code 400 (Bad Request)} if the eligibilityCondition has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/eligibility-conditions")
    public ResponseEntity<EligibilityCondition> createEligibilityCondition(@RequestBody EligibilityCondition eligibilityCondition)
        throws URISyntaxException {
        log.debug("REST request to save EligibilityCondition : {}", eligibilityCondition);
        if (eligibilityCondition.getId() != null) {
            throw new BadRequestAlertException("A new eligibilityCondition cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EligibilityCondition result = eligibilityConditionRepository.save(eligibilityCondition);
        return ResponseEntity
            .created(new URI("/api/eligibility-conditions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /eligibility-conditions/:id} : Updates an existing eligibilityCondition.
     *
     * @param id the id of the eligibilityCondition to save.
     * @param eligibilityCondition the eligibilityCondition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eligibilityCondition,
     * or with status {@code 400 (Bad Request)} if the eligibilityCondition is not valid,
     * or with status {@code 500 (Internal Server Error)} if the eligibilityCondition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/eligibility-conditions/{id}")
    public ResponseEntity<EligibilityCondition> updateEligibilityCondition(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EligibilityCondition eligibilityCondition
    ) throws URISyntaxException {
        log.debug("REST request to update EligibilityCondition : {}, {}", id, eligibilityCondition);
        if (eligibilityCondition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eligibilityCondition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eligibilityConditionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EligibilityCondition result = eligibilityConditionRepository.save(eligibilityCondition);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eligibilityCondition.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /eligibility-conditions/:id} : Partial updates given fields of an existing eligibilityCondition, field will ignore if it is null
     *
     * @param id the id of the eligibilityCondition to save.
     * @param eligibilityCondition the eligibilityCondition to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated eligibilityCondition,
     * or with status {@code 400 (Bad Request)} if the eligibilityCondition is not valid,
     * or with status {@code 404 (Not Found)} if the eligibilityCondition is not found,
     * or with status {@code 500 (Internal Server Error)} if the eligibilityCondition couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/eligibility-conditions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EligibilityCondition> partialUpdateEligibilityCondition(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody EligibilityCondition eligibilityCondition
    ) throws URISyntaxException {
        log.debug("REST request to partial update EligibilityCondition partially : {}, {}", id, eligibilityCondition);
        if (eligibilityCondition.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, eligibilityCondition.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eligibilityConditionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EligibilityCondition> result = eligibilityConditionRepository
            .findById(eligibilityCondition.getId())
            .map(existingEligibilityCondition -> {
                if (eligibilityCondition.getApplyLevelEnum() != null) {
                    existingEligibilityCondition.setApplyLevelEnum(eligibilityCondition.getApplyLevelEnum());
                }

                return existingEligibilityCondition;
            })
            .map(eligibilityConditionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, eligibilityCondition.getId().toString())
        );
    }

    /**
     * {@code GET  /eligibility-conditions} : get all the eligibilityConditions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of eligibilityConditions in body.
     */
    @GetMapping("/eligibility-conditions")
    public List<EligibilityCondition> getAllEligibilityConditions() {
        log.debug("REST request to get all EligibilityConditions");
        return eligibilityConditionRepository.findAll();
    }

    /**
     * {@code GET  /eligibility-conditions/:id} : get the "id" eligibilityCondition.
     *
     * @param id the id of the eligibilityCondition to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the eligibilityCondition, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/eligibility-conditions/{id}")
    public ResponseEntity<EligibilityCondition> getEligibilityCondition(@PathVariable Long id) {
        log.debug("REST request to get EligibilityCondition : {}", id);
        Optional<EligibilityCondition> eligibilityCondition = eligibilityConditionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(eligibilityCondition);
    }

    /**
     * {@code DELETE  /eligibility-conditions/:id} : delete the "id" eligibilityCondition.
     *
     * @param id the id of the eligibilityCondition to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/eligibility-conditions/{id}")
    public ResponseEntity<Void> deleteEligibilityCondition(@PathVariable Long id) {
        log.debug("REST request to delete EligibilityCondition : {}", id);
        eligibilityConditionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
