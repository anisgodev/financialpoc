package com.bnppf.alphacredit.repositories.productrepository.web.rest;

import com.bnppf.alphacredit.repositories.productrepository.domain.ProductItemType;
import com.bnppf.alphacredit.repositories.productrepository.repository.ProductItemTypeRepository;
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
 * REST controller for managing {@link com.bnppf.alphacredit.repositories.productrepository.domain.ProductItemType}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProductItemTypeResource {

    private final Logger log = LoggerFactory.getLogger(ProductItemTypeResource.class);

    private static final String ENTITY_NAME = "productItemType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductItemTypeRepository productItemTypeRepository;

    public ProductItemTypeResource(ProductItemTypeRepository productItemTypeRepository) {
        this.productItemTypeRepository = productItemTypeRepository;
    }

    /**
     * {@code POST  /product-item-types} : Create a new productItemType.
     *
     * @param productItemType the productItemType to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productItemType, or with status {@code 400 (Bad Request)} if the productItemType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/product-item-types")
    public ResponseEntity<ProductItemType> createProductItemType(@RequestBody ProductItemType productItemType) throws URISyntaxException {
        log.debug("REST request to save ProductItemType : {}", productItemType);
        if (productItemType.getId() != null) {
            throw new BadRequestAlertException("A new productItemType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductItemType result = productItemTypeRepository.save(productItemType);
        return ResponseEntity
            .created(new URI("/api/product-item-types/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /product-item-types/:id} : Updates an existing productItemType.
     *
     * @param id the id of the productItemType to save.
     * @param productItemType the productItemType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productItemType,
     * or with status {@code 400 (Bad Request)} if the productItemType is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productItemType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/product-item-types/{id}")
    public ResponseEntity<ProductItemType> updateProductItemType(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProductItemType productItemType
    ) throws URISyntaxException {
        log.debug("REST request to update ProductItemType : {}, {}", id, productItemType);
        if (productItemType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productItemType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productItemTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProductItemType result = productItemTypeRepository.save(productItemType);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productItemType.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /product-item-types/:id} : Partial updates given fields of an existing productItemType, field will ignore if it is null
     *
     * @param id the id of the productItemType to save.
     * @param productItemType the productItemType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productItemType,
     * or with status {@code 400 (Bad Request)} if the productItemType is not valid,
     * or with status {@code 404 (Not Found)} if the productItemType is not found,
     * or with status {@code 500 (Internal Server Error)} if the productItemType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/product-item-types/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProductItemType> partialUpdateProductItemType(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProductItemType productItemType
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProductItemType partially : {}, {}", id, productItemType);
        if (productItemType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productItemType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productItemTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProductItemType> result = productItemTypeRepository
            .findById(productItemType.getId())
            .map(existingProductItemType -> {
                if (productItemType.getProductItemCategory() != null) {
                    existingProductItemType.setProductItemCategory(productItemType.getProductItemCategory());
                }
                if (productItemType.getTypeName() != null) {
                    existingProductItemType.setTypeName(productItemType.getTypeName());
                }
                if (productItemType.getStateEnum() != null) {
                    existingProductItemType.setStateEnum(productItemType.getStateEnum());
                }

                return existingProductItemType;
            })
            .map(productItemTypeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productItemType.getId().toString())
        );
    }

    /**
     * {@code GET  /product-item-types} : get all the productItemTypes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productItemTypes in body.
     */
    @GetMapping("/product-item-types")
    public List<ProductItemType> getAllProductItemTypes() {
        log.debug("REST request to get all ProductItemTypes");
        return productItemTypeRepository.findAll();
    }

    /**
     * {@code GET  /product-item-types/:id} : get the "id" productItemType.
     *
     * @param id the id of the productItemType to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productItemType, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/product-item-types/{id}")
    public ResponseEntity<ProductItemType> getProductItemType(@PathVariable Long id) {
        log.debug("REST request to get ProductItemType : {}", id);
        Optional<ProductItemType> productItemType = productItemTypeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(productItemType);
    }

    /**
     * {@code DELETE  /product-item-types/:id} : delete the "id" productItemType.
     *
     * @param id the id of the productItemType to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/product-item-types/{id}")
    public ResponseEntity<Void> deleteProductItemType(@PathVariable Long id) {
        log.debug("REST request to delete ProductItemType : {}", id);
        productItemTypeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
