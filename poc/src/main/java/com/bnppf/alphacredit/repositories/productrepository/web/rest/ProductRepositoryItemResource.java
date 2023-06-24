package com.bnppf.alphacredit.repositories.productrepository.web.rest;

import com.bnppf.alphacredit.repositories.productrepository.domain.ProductRepositoryItem;
import com.bnppf.alphacredit.repositories.productrepository.repository.ProductRepositoryItemRepository;
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
 * REST controller for managing {@link com.bnppf.alphacredit.repositories.productrepository.domain.ProductRepositoryItem}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProductRepositoryItemResource {

    private final Logger log = LoggerFactory.getLogger(ProductRepositoryItemResource.class);

    private static final String ENTITY_NAME = "productRepositoryItem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductRepositoryItemRepository productRepositoryItemRepository;

    public ProductRepositoryItemResource(ProductRepositoryItemRepository productRepositoryItemRepository) {
        this.productRepositoryItemRepository = productRepositoryItemRepository;
    }

    /**
     * {@code POST  /product-repository-items} : Create a new productRepositoryItem.
     *
     * @param productRepositoryItem the productRepositoryItem to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productRepositoryItem, or with status {@code 400 (Bad Request)} if the productRepositoryItem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/product-repository-items")
    public ResponseEntity<ProductRepositoryItem> createProductRepositoryItem(@RequestBody ProductRepositoryItem productRepositoryItem)
        throws URISyntaxException {
        log.debug("REST request to save ProductRepositoryItem : {}", productRepositoryItem);
        if (productRepositoryItem.getId() != null) {
            throw new BadRequestAlertException("A new productRepositoryItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductRepositoryItem result = productRepositoryItemRepository.save(productRepositoryItem);
        return ResponseEntity
            .created(new URI("/api/product-repository-items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /product-repository-items/:id} : Updates an existing productRepositoryItem.
     *
     * @param id the id of the productRepositoryItem to save.
     * @param productRepositoryItem the productRepositoryItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productRepositoryItem,
     * or with status {@code 400 (Bad Request)} if the productRepositoryItem is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productRepositoryItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/product-repository-items/{id}")
    public ResponseEntity<ProductRepositoryItem> updateProductRepositoryItem(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProductRepositoryItem productRepositoryItem
    ) throws URISyntaxException {
        log.debug("REST request to update ProductRepositoryItem : {}, {}", id, productRepositoryItem);
        if (productRepositoryItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productRepositoryItem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productRepositoryItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProductRepositoryItem result = productRepositoryItemRepository.save(productRepositoryItem);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productRepositoryItem.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /product-repository-items/:id} : Partial updates given fields of an existing productRepositoryItem, field will ignore if it is null
     *
     * @param id the id of the productRepositoryItem to save.
     * @param productRepositoryItem the productRepositoryItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productRepositoryItem,
     * or with status {@code 400 (Bad Request)} if the productRepositoryItem is not valid,
     * or with status {@code 404 (Not Found)} if the productRepositoryItem is not found,
     * or with status {@code 500 (Internal Server Error)} if the productRepositoryItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/product-repository-items/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ProductRepositoryItem> partialUpdateProductRepositoryItem(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ProductRepositoryItem productRepositoryItem
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProductRepositoryItem partially : {}, {}", id, productRepositoryItem);
        if (productRepositoryItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productRepositoryItem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productRepositoryItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProductRepositoryItem> result = productRepositoryItemRepository
            .findById(productRepositoryItem.getId())
            .map(existingProductRepositoryItem -> {
                if (productRepositoryItem.getName() != null) {
                    existingProductRepositoryItem.setName(productRepositoryItem.getName());
                }
                if (productRepositoryItem.getDescription() != null) {
                    existingProductRepositoryItem.setDescription(productRepositoryItem.getDescription());
                }
                if (productRepositoryItem.getProductItemCategoryEnum() != null) {
                    existingProductRepositoryItem.setProductItemCategoryEnum(productRepositoryItem.getProductItemCategoryEnum());
                }
                if (productRepositoryItem.getItemStage() != null) {
                    existingProductRepositoryItem.setItemStage(productRepositoryItem.getItemStage());
                }

                return existingProductRepositoryItem;
            })
            .map(productRepositoryItemRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productRepositoryItem.getId().toString())
        );
    }

    /**
     * {@code GET  /product-repository-items} : get all the productRepositoryItems.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productRepositoryItems in body.
     */
    @GetMapping("/product-repository-items")
    public List<ProductRepositoryItem> getAllProductRepositoryItems() {
        log.debug("REST request to get all ProductRepositoryItems");
        return productRepositoryItemRepository.findAll();
    }

    /**
     * {@code GET  /product-repository-items/:id} : get the "id" productRepositoryItem.
     *
     * @param id the id of the productRepositoryItem to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productRepositoryItem, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/product-repository-items/{id}")
    public ResponseEntity<ProductRepositoryItem> getProductRepositoryItem(@PathVariable Long id) {
        log.debug("REST request to get ProductRepositoryItem : {}", id);
        Optional<ProductRepositoryItem> productRepositoryItem = productRepositoryItemRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(productRepositoryItem);
    }

    /**
     * {@code DELETE  /product-repository-items/:id} : delete the "id" productRepositoryItem.
     *
     * @param id the id of the productRepositoryItem to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/product-repository-items/{id}")
    public ResponseEntity<Void> deleteProductRepositoryItem(@PathVariable Long id) {
        log.debug("REST request to delete ProductRepositoryItem : {}", id);
        productRepositoryItemRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
