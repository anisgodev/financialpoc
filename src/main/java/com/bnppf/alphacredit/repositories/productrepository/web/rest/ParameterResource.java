package com.bnppf.alphacredit.repositories.productrepository.web.rest;

import com.bnppf.alphacredit.repositories.productrepository.domain.Parameter;
import com.bnppf.alphacredit.repositories.productrepository.repository.ParameterRepository;
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
 * REST controller for managing {@link com.bnppf.alphacredit.repositories.productrepository.domain.Parameter}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ParameterResource {

    private final Logger log = LoggerFactory.getLogger(ParameterResource.class);

    private static final String ENTITY_NAME = "parameter";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ParameterRepository parameterRepository;

    public ParameterResource(ParameterRepository parameterRepository) {
        this.parameterRepository = parameterRepository;
    }

    /**
     * {@code POST  /parameters} : Create a new parameter.
     *
     * @param parameter the parameter to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new parameter, or with status {@code 400 (Bad Request)} if the parameter has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/parameters")
    public ResponseEntity<Parameter> createParameter(@RequestBody Parameter parameter) throws URISyntaxException {
        log.debug("REST request to save Parameter : {}", parameter);
        if (parameter.getId() != null) {
            throw new BadRequestAlertException("A new parameter cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Parameter result = parameterRepository.save(parameter);
        return ResponseEntity
            .created(new URI("/api/parameters/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /parameters/:id} : Updates an existing parameter.
     *
     * @param id the id of the parameter to save.
     * @param parameter the parameter to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parameter,
     * or with status {@code 400 (Bad Request)} if the parameter is not valid,
     * or with status {@code 500 (Internal Server Error)} if the parameter couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/parameters/{id}")
    public ResponseEntity<Parameter> updateParameter(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Parameter parameter
    ) throws URISyntaxException {
        log.debug("REST request to update Parameter : {}, {}", id, parameter);
        if (parameter.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parameter.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!parameterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Parameter result = parameterRepository.save(parameter);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, parameter.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /parameters/:id} : Partial updates given fields of an existing parameter, field will ignore if it is null
     *
     * @param id the id of the parameter to save.
     * @param parameter the parameter to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated parameter,
     * or with status {@code 400 (Bad Request)} if the parameter is not valid,
     * or with status {@code 404 (Not Found)} if the parameter is not found,
     * or with status {@code 500 (Internal Server Error)} if the parameter couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/parameters/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Parameter> partialUpdateParameter(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Parameter parameter
    ) throws URISyntaxException {
        log.debug("REST request to partial update Parameter partially : {}, {}", id, parameter);
        if (parameter.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, parameter.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!parameterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Parameter> result = parameterRepository
            .findById(parameter.getId())
            .map(existingParameter -> {
                if (parameter.getType() != null) {
                    existingParameter.setType(parameter.getType());
                }
                if (parameter.getParameterStateEnum() != null) {
                    existingParameter.setParameterStateEnum(parameter.getParameterStateEnum());
                }

                return existingParameter;
            })
            .map(parameterRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, parameter.getId().toString())
        );
    }

    /**
     * {@code GET  /parameters} : get all the parameters.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of parameters in body.
     */
    @GetMapping("/parameters")
    public List<Parameter> getAllParameters() {
        log.debug("REST request to get all Parameters");
        return parameterRepository.findAll();
    }

    /**
     * {@code GET  /parameters/:id} : get the "id" parameter.
     *
     * @param id the id of the parameter to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the parameter, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/parameters/{id}")
    public ResponseEntity<Parameter> getParameter(@PathVariable Long id) {
        log.debug("REST request to get Parameter : {}", id);
        Optional<Parameter> parameter = parameterRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(parameter);
    }

    /**
     * {@code DELETE  /parameters/:id} : delete the "id" parameter.
     *
     * @param id the id of the parameter to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/parameters/{id}")
    public ResponseEntity<Void> deleteParameter(@PathVariable Long id) {
        log.debug("REST request to delete Parameter : {}", id);
        parameterRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
