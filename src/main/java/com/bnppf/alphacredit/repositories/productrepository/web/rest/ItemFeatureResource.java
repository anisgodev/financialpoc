package com.bnppf.alphacredit.repositories.productrepository.web.rest;

import com.bnppf.alphacredit.repositories.productrepository.domain.ItemFeature;
import com.bnppf.alphacredit.repositories.productrepository.repository.ItemFeatureRepository;
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
 * REST controller for managing {@link com.bnppf.alphacredit.repositories.productrepository.domain.ItemFeature}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ItemFeatureResource {

    private final Logger log = LoggerFactory.getLogger(ItemFeatureResource.class);

    private static final String ENTITY_NAME = "itemFeature";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ItemFeatureRepository itemFeatureRepository;

    public ItemFeatureResource(ItemFeatureRepository itemFeatureRepository) {
        this.itemFeatureRepository = itemFeatureRepository;
    }

    /**
     * {@code POST  /item-features} : Create a new itemFeature.
     *
     * @param itemFeature the itemFeature to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new itemFeature, or with status {@code 400 (Bad Request)} if the itemFeature has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/item-features")
    public ResponseEntity<ItemFeature> createItemFeature(@RequestBody ItemFeature itemFeature) throws URISyntaxException {
        log.debug("REST request to save ItemFeature : {}", itemFeature);
        if (itemFeature.getId() != null) {
            throw new BadRequestAlertException("A new itemFeature cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ItemFeature result = itemFeatureRepository.save(itemFeature);
        return ResponseEntity
            .created(new URI("/api/item-features/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /item-features/:id} : Updates an existing itemFeature.
     *
     * @param id the id of the itemFeature to save.
     * @param itemFeature the itemFeature to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itemFeature,
     * or with status {@code 400 (Bad Request)} if the itemFeature is not valid,
     * or with status {@code 500 (Internal Server Error)} if the itemFeature couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/item-features/{id}")
    public ResponseEntity<ItemFeature> updateItemFeature(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ItemFeature itemFeature
    ) throws URISyntaxException {
        log.debug("REST request to update ItemFeature : {}, {}", id, itemFeature);
        if (itemFeature.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itemFeature.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itemFeatureRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ItemFeature result = itemFeatureRepository.save(itemFeature);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, itemFeature.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /item-features/:id} : Partial updates given fields of an existing itemFeature, field will ignore if it is null
     *
     * @param id the id of the itemFeature to save.
     * @param itemFeature the itemFeature to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated itemFeature,
     * or with status {@code 400 (Bad Request)} if the itemFeature is not valid,
     * or with status {@code 404 (Not Found)} if the itemFeature is not found,
     * or with status {@code 500 (Internal Server Error)} if the itemFeature couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/item-features/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ItemFeature> partialUpdateItemFeature(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ItemFeature itemFeature
    ) throws URISyntaxException {
        log.debug("REST request to partial update ItemFeature partially : {}, {}", id, itemFeature);
        if (itemFeature.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, itemFeature.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!itemFeatureRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ItemFeature> result = itemFeatureRepository
            .findById(itemFeature.getId())
            .map(existingItemFeature -> {
                if (itemFeature.getFeatureName() != null) {
                    existingItemFeature.setFeatureName(itemFeature.getFeatureName());
                }
                if (itemFeature.getFeatureLabel() != null) {
                    existingItemFeature.setFeatureLabel(itemFeature.getFeatureLabel());
                }

                return existingItemFeature;
            })
            .map(itemFeatureRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, itemFeature.getId().toString())
        );
    }

    /**
     * {@code GET  /item-features} : get all the itemFeatures.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of itemFeatures in body.
     */
    @GetMapping("/item-features")
    public List<ItemFeature> getAllItemFeatures() {
        log.debug("REST request to get all ItemFeatures");
        return itemFeatureRepository.findAll();
    }

    /**
     * {@code GET  /item-features/:id} : get the "id" itemFeature.
     *
     * @param id the id of the itemFeature to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the itemFeature, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/item-features/{id}")
    public ResponseEntity<ItemFeature> getItemFeature(@PathVariable Long id) {
        log.debug("REST request to get ItemFeature : {}", id);
        Optional<ItemFeature> itemFeature = itemFeatureRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(itemFeature);
    }

    /**
     * {@code DELETE  /item-features/:id} : delete the "id" itemFeature.
     *
     * @param id the id of the itemFeature to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/item-features/{id}")
    public ResponseEntity<Void> deleteItemFeature(@PathVariable Long id) {
        log.debug("REST request to delete ItemFeature : {}", id);
        itemFeatureRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
