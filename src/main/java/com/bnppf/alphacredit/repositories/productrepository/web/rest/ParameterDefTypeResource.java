package com.bnppf.alphacredit.repositories.productrepository.web.rest;

import com.bnppf.alphacredit.repositories.productrepository.domain.ParameterDefType;
import com.bnppf.alphacredit.repositories.productrepository.repository.ParameterDefTypeRepository;
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
 * REST controller for managing {@link com.bnppf.alphacredit.repositories.productrepository.domain.ParameterDefType}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ParameterDefTypeResource {

    private final Logger log = LoggerFactory.getLogger(ParameterDefTypeResource.class);

    private static final String ENTITY_NAME = "parameterDefType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ParameterDefTypeRepository parameterDefTypeRepository;

    public ParameterDefTypeResource(ParameterDefTypeRepository parameterDefTypeRepository) {
        this.parameterDefTypeRepository = parameterDefTypeRepository;
    }

    /**
     * {@code POST  /parameter-def-types} : Create a new parameterDefType.
     *
     * @param parameterDefType the parameterDefType to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new parameterDefType, or with status {@code 400 (Bad Request)} if the parameterDefType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/parameter-def-types")
    public ResponseEntity<ParameterDefType> createParameterDefType(@RequestBody ParameterDefType parameterDefType)
        throws URISyntaxException {
        log.debug("REST request to save ParameterDefType : {}", parameterDefType);
        if (parameterDefType.getId() != null) {
            throw new BadRequestAlertException("A new parameterDefType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ParameterDefType result = parameterDefTypeRepository.save(parameterDefType);
        return ResponseEntity
            .created(new URI("/api/parameter-def-types/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /parameter-def-types/:id} : Updates an existing parameterDefType.
     *
     * @param id the id of the parameterDefType to save.
     * @param parameterDefType the parameterDefType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parameterDefType,
     * or with status {@code 400 (Bad Request)} if the parameterDefType is not valid,
     * or with status {@code 500 (Internal Server Error)} if the parameterDefType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/parameter-def-types/{id}")
    public ResponseEntity<ParameterDefType> updateParameterDefType(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ParameterDefType parameterDefType
    ) throws URISyntaxException {
        log.debug("REST request to update ParameterDefType : {}, {}", id, parameterDefType);
        if (parameterDefType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parameterDefType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!parameterDefTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ParameterDefType result = parameterDefTypeRepository.save(parameterDefType);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, parameterDefType.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /parameter-def-types/:id} : Partial updates given fields of an existing parameterDefType, field will ignore if it is null
     *
     * @param id the id of the parameterDefType to save.
     * @param parameterDefType the parameterDefType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parameterDefType,
     * or with status {@code 400 (Bad Request)} if the parameterDefType is not valid,
     * or with status {@code 404 (Not Found)} if the parameterDefType is not found,
     * or with status {@code 500 (Internal Server Error)} if the parameterDefType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/parameter-def-types/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ParameterDefType> partialUpdateParameterDefType(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ParameterDefType parameterDefType
    ) throws URISyntaxException {
        log.debug("REST request to partial update ParameterDefType partially : {}, {}", id, parameterDefType);
        if (parameterDefType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parameterDefType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!parameterDefTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ParameterDefType> result = parameterDefTypeRepository
            .findById(parameterDefType.getId())
            .map(existingParameterDefType -> {
                if (parameterDefType.getFieldName() != null) {
                    existingParameterDefType.setFieldName(parameterDefType.getFieldName());
                }
                if (parameterDefType.getLabel() != null) {
                    existingParameterDefType.setLabel(parameterDefType.getLabel());
                }
                if (parameterDefType.getParameterGroupEnum() != null) {
                    existingParameterDefType.setParameterGroupEnum(parameterDefType.getParameterGroupEnum());
                }

                return existingParameterDefType;
            })
            .map(parameterDefTypeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, parameterDefType.getId().toString())
        );
    }

    /**
     * {@code GET  /parameter-def-types} : get all the parameterDefTypes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of parameterDefTypes in body.
     */
    @GetMapping("/parameter-def-types")
    public List<ParameterDefType> getAllParameterDefTypes() {
        log.debug("REST request to get all ParameterDefTypes");
        return parameterDefTypeRepository.findAll();
    }

    /**
     * {@code GET  /parameter-def-types/:id} : get the "id" parameterDefType.
     *
     * @param id the id of the parameterDefType to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the parameterDefType, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/parameter-def-types/{id}")
    public ResponseEntity<ParameterDefType> getParameterDefType(@PathVariable Long id) {
        log.debug("REST request to get ParameterDefType : {}", id);
        Optional<ParameterDefType> parameterDefType = parameterDefTypeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(parameterDefType);
    }

    /**
     * {@code DELETE  /parameter-def-types/:id} : delete the "id" parameterDefType.
     *
     * @param id the id of the parameterDefType to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/parameter-def-types/{id}")
    public ResponseEntity<Void> deleteParameterDefType(@PathVariable Long id) {
        log.debug("REST request to delete ParameterDefType : {}", id);
        parameterDefTypeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
