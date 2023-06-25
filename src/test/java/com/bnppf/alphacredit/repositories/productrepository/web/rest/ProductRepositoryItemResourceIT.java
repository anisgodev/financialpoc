package com.bnppf.alphacredit.repositories.productrepository.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bnppf.alphacredit.repositories.productrepository.IntegrationTest;
import com.bnppf.alphacredit.repositories.productrepository.domain.ProductRepositoryItem;
import com.bnppf.alphacredit.repositories.productrepository.domain.enumeration.ProductItemCategoryEnum;
import com.bnppf.alphacredit.repositories.productrepository.domain.enumeration.ProductItemStateEnum;
import com.bnppf.alphacredit.repositories.productrepository.repository.ProductRepositoryItemRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProductRepositoryItemResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProductRepositoryItemResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ProductItemCategoryEnum DEFAULT_PRODUCT_ITEM_CATEGORY_ENUM = ProductItemCategoryEnum.PRODUCT;
    private static final ProductItemCategoryEnum UPDATED_PRODUCT_ITEM_CATEGORY_ENUM = ProductItemCategoryEnum.SERVICE;

    private static final ProductItemStateEnum DEFAULT_ITEM_STAGE = ProductItemStateEnum.Active;
    private static final ProductItemStateEnum UPDATED_ITEM_STAGE = ProductItemStateEnum.INACTIVE;

    private static final String ENTITY_API_URL = "/api/product-repository-items";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProductRepositoryItemRepository productRepositoryItemRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductRepositoryItemMockMvc;

    private ProductRepositoryItem productRepositoryItem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductRepositoryItem createEntity(EntityManager em) {
        ProductRepositoryItem productRepositoryItem = new ProductRepositoryItem()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .productItemCategoryEnum(DEFAULT_PRODUCT_ITEM_CATEGORY_ENUM)
            .itemStage(DEFAULT_ITEM_STAGE);
        return productRepositoryItem;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductRepositoryItem createUpdatedEntity(EntityManager em) {
        ProductRepositoryItem productRepositoryItem = new ProductRepositoryItem()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .productItemCategoryEnum(UPDATED_PRODUCT_ITEM_CATEGORY_ENUM)
            .itemStage(UPDATED_ITEM_STAGE);
        return productRepositoryItem;
    }

    @BeforeEach
    public void initTest() {
        productRepositoryItem = createEntity(em);
    }

    @Test
    @Transactional
    void createProductRepositoryItem() throws Exception {
        int databaseSizeBeforeCreate = productRepositoryItemRepository.findAll().size();
        // Create the ProductRepositoryItem
        restProductRepositoryItemMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productRepositoryItem))
            )
            .andExpect(status().isCreated());

        // Validate the ProductRepositoryItem in the database
        List<ProductRepositoryItem> productRepositoryItemList = productRepositoryItemRepository.findAll();
        assertThat(productRepositoryItemList).hasSize(databaseSizeBeforeCreate + 1);
        ProductRepositoryItem testProductRepositoryItem = productRepositoryItemList.get(productRepositoryItemList.size() - 1);
        assertThat(testProductRepositoryItem.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProductRepositoryItem.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testProductRepositoryItem.getProductItemCategoryEnum()).isEqualTo(DEFAULT_PRODUCT_ITEM_CATEGORY_ENUM);
        assertThat(testProductRepositoryItem.getItemStage()).isEqualTo(DEFAULT_ITEM_STAGE);
    }

    @Test
    @Transactional
    void createProductRepositoryItemWithExistingId() throws Exception {
        // Create the ProductRepositoryItem with an existing ID
        productRepositoryItem.setId(1L);

        int databaseSizeBeforeCreate = productRepositoryItemRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductRepositoryItemMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productRepositoryItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductRepositoryItem in the database
        List<ProductRepositoryItem> productRepositoryItemList = productRepositoryItemRepository.findAll();
        assertThat(productRepositoryItemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProductRepositoryItems() throws Exception {
        // Initialize the database
        productRepositoryItemRepository.saveAndFlush(productRepositoryItem);

        // Get all the productRepositoryItemList
        restProductRepositoryItemMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productRepositoryItem.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].productItemCategoryEnum").value(hasItem(DEFAULT_PRODUCT_ITEM_CATEGORY_ENUM.toString())))
            .andExpect(jsonPath("$.[*].itemStage").value(hasItem(DEFAULT_ITEM_STAGE.toString())));
    }

    @Test
    @Transactional
    void getProductRepositoryItem() throws Exception {
        // Initialize the database
        productRepositoryItemRepository.saveAndFlush(productRepositoryItem);

        // Get the productRepositoryItem
        restProductRepositoryItemMockMvc
            .perform(get(ENTITY_API_URL_ID, productRepositoryItem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productRepositoryItem.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.productItemCategoryEnum").value(DEFAULT_PRODUCT_ITEM_CATEGORY_ENUM.toString()))
            .andExpect(jsonPath("$.itemStage").value(DEFAULT_ITEM_STAGE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingProductRepositoryItem() throws Exception {
        // Get the productRepositoryItem
        restProductRepositoryItemMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProductRepositoryItem() throws Exception {
        // Initialize the database
        productRepositoryItemRepository.saveAndFlush(productRepositoryItem);

        int databaseSizeBeforeUpdate = productRepositoryItemRepository.findAll().size();

        // Update the productRepositoryItem
        ProductRepositoryItem updatedProductRepositoryItem = productRepositoryItemRepository.findById(productRepositoryItem.getId()).get();
        // Disconnect from session so that the updates on updatedProductRepositoryItem are not directly saved in db
        em.detach(updatedProductRepositoryItem);
        updatedProductRepositoryItem
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .productItemCategoryEnum(UPDATED_PRODUCT_ITEM_CATEGORY_ENUM)
            .itemStage(UPDATED_ITEM_STAGE);

        restProductRepositoryItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProductRepositoryItem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProductRepositoryItem))
            )
            .andExpect(status().isOk());

        // Validate the ProductRepositoryItem in the database
        List<ProductRepositoryItem> productRepositoryItemList = productRepositoryItemRepository.findAll();
        assertThat(productRepositoryItemList).hasSize(databaseSizeBeforeUpdate);
        ProductRepositoryItem testProductRepositoryItem = productRepositoryItemList.get(productRepositoryItemList.size() - 1);
        assertThat(testProductRepositoryItem.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProductRepositoryItem.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProductRepositoryItem.getProductItemCategoryEnum()).isEqualTo(UPDATED_PRODUCT_ITEM_CATEGORY_ENUM);
        assertThat(testProductRepositoryItem.getItemStage()).isEqualTo(UPDATED_ITEM_STAGE);
    }

    @Test
    @Transactional
    void putNonExistingProductRepositoryItem() throws Exception {
        int databaseSizeBeforeUpdate = productRepositoryItemRepository.findAll().size();
        productRepositoryItem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductRepositoryItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productRepositoryItem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productRepositoryItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductRepositoryItem in the database
        List<ProductRepositoryItem> productRepositoryItemList = productRepositoryItemRepository.findAll();
        assertThat(productRepositoryItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProductRepositoryItem() throws Exception {
        int databaseSizeBeforeUpdate = productRepositoryItemRepository.findAll().size();
        productRepositoryItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductRepositoryItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productRepositoryItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductRepositoryItem in the database
        List<ProductRepositoryItem> productRepositoryItemList = productRepositoryItemRepository.findAll();
        assertThat(productRepositoryItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProductRepositoryItem() throws Exception {
        int databaseSizeBeforeUpdate = productRepositoryItemRepository.findAll().size();
        productRepositoryItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductRepositoryItemMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productRepositoryItem))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductRepositoryItem in the database
        List<ProductRepositoryItem> productRepositoryItemList = productRepositoryItemRepository.findAll();
        assertThat(productRepositoryItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProductRepositoryItemWithPatch() throws Exception {
        // Initialize the database
        productRepositoryItemRepository.saveAndFlush(productRepositoryItem);

        int databaseSizeBeforeUpdate = productRepositoryItemRepository.findAll().size();

        // Update the productRepositoryItem using partial update
        ProductRepositoryItem partialUpdatedProductRepositoryItem = new ProductRepositoryItem();
        partialUpdatedProductRepositoryItem.setId(productRepositoryItem.getId());

        partialUpdatedProductRepositoryItem.description(UPDATED_DESCRIPTION);

        restProductRepositoryItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductRepositoryItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductRepositoryItem))
            )
            .andExpect(status().isOk());

        // Validate the ProductRepositoryItem in the database
        List<ProductRepositoryItem> productRepositoryItemList = productRepositoryItemRepository.findAll();
        assertThat(productRepositoryItemList).hasSize(databaseSizeBeforeUpdate);
        ProductRepositoryItem testProductRepositoryItem = productRepositoryItemList.get(productRepositoryItemList.size() - 1);
        assertThat(testProductRepositoryItem.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProductRepositoryItem.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProductRepositoryItem.getProductItemCategoryEnum()).isEqualTo(DEFAULT_PRODUCT_ITEM_CATEGORY_ENUM);
        assertThat(testProductRepositoryItem.getItemStage()).isEqualTo(DEFAULT_ITEM_STAGE);
    }

    @Test
    @Transactional
    void fullUpdateProductRepositoryItemWithPatch() throws Exception {
        // Initialize the database
        productRepositoryItemRepository.saveAndFlush(productRepositoryItem);

        int databaseSizeBeforeUpdate = productRepositoryItemRepository.findAll().size();

        // Update the productRepositoryItem using partial update
        ProductRepositoryItem partialUpdatedProductRepositoryItem = new ProductRepositoryItem();
        partialUpdatedProductRepositoryItem.setId(productRepositoryItem.getId());

        partialUpdatedProductRepositoryItem
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .productItemCategoryEnum(UPDATED_PRODUCT_ITEM_CATEGORY_ENUM)
            .itemStage(UPDATED_ITEM_STAGE);

        restProductRepositoryItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductRepositoryItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductRepositoryItem))
            )
            .andExpect(status().isOk());

        // Validate the ProductRepositoryItem in the database
        List<ProductRepositoryItem> productRepositoryItemList = productRepositoryItemRepository.findAll();
        assertThat(productRepositoryItemList).hasSize(databaseSizeBeforeUpdate);
        ProductRepositoryItem testProductRepositoryItem = productRepositoryItemList.get(productRepositoryItemList.size() - 1);
        assertThat(testProductRepositoryItem.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProductRepositoryItem.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProductRepositoryItem.getProductItemCategoryEnum()).isEqualTo(UPDATED_PRODUCT_ITEM_CATEGORY_ENUM);
        assertThat(testProductRepositoryItem.getItemStage()).isEqualTo(UPDATED_ITEM_STAGE);
    }

    @Test
    @Transactional
    void patchNonExistingProductRepositoryItem() throws Exception {
        int databaseSizeBeforeUpdate = productRepositoryItemRepository.findAll().size();
        productRepositoryItem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductRepositoryItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, productRepositoryItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productRepositoryItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductRepositoryItem in the database
        List<ProductRepositoryItem> productRepositoryItemList = productRepositoryItemRepository.findAll();
        assertThat(productRepositoryItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProductRepositoryItem() throws Exception {
        int databaseSizeBeforeUpdate = productRepositoryItemRepository.findAll().size();
        productRepositoryItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductRepositoryItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productRepositoryItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductRepositoryItem in the database
        List<ProductRepositoryItem> productRepositoryItemList = productRepositoryItemRepository.findAll();
        assertThat(productRepositoryItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProductRepositoryItem() throws Exception {
        int databaseSizeBeforeUpdate = productRepositoryItemRepository.findAll().size();
        productRepositoryItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductRepositoryItemMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productRepositoryItem))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductRepositoryItem in the database
        List<ProductRepositoryItem> productRepositoryItemList = productRepositoryItemRepository.findAll();
        assertThat(productRepositoryItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProductRepositoryItem() throws Exception {
        // Initialize the database
        productRepositoryItemRepository.saveAndFlush(productRepositoryItem);

        int databaseSizeBeforeDelete = productRepositoryItemRepository.findAll().size();

        // Delete the productRepositoryItem
        restProductRepositoryItemMockMvc
            .perform(delete(ENTITY_API_URL_ID, productRepositoryItem.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProductRepositoryItem> productRepositoryItemList = productRepositoryItemRepository.findAll();
        assertThat(productRepositoryItemList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
