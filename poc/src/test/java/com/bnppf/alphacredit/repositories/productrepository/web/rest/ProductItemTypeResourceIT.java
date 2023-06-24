package com.bnppf.alphacredit.repositories.productrepository.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bnppf.alphacredit.repositories.productrepository.IntegrationTest;
import com.bnppf.alphacredit.repositories.productrepository.domain.ProductItemType;
import com.bnppf.alphacredit.repositories.productrepository.domain.enumeration.ProductItemCategoryEnum;
import com.bnppf.alphacredit.repositories.productrepository.domain.enumeration.StateEnum;
import com.bnppf.alphacredit.repositories.productrepository.repository.ProductItemTypeRepository;
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
 * Integration tests for the {@link ProductItemTypeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProductItemTypeResourceIT {

    private static final ProductItemCategoryEnum DEFAULT_PRODUCT_ITEM_CATEGORY = ProductItemCategoryEnum.PRODUCT;
    private static final ProductItemCategoryEnum UPDATED_PRODUCT_ITEM_CATEGORY = ProductItemCategoryEnum.SERVICE;

    private static final String DEFAULT_TYPE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_TYPE_NAME = "BBBBBBBBBB";

    private static final StateEnum DEFAULT_STATE_ENUM = StateEnum.ENABLED;
    private static final StateEnum UPDATED_STATE_ENUM = StateEnum.DISABLED;

    private static final String ENTITY_API_URL = "/api/product-item-types";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProductItemTypeRepository productItemTypeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductItemTypeMockMvc;

    private ProductItemType productItemType;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductItemType createEntity(EntityManager em) {
        ProductItemType productItemType = new ProductItemType()
            .productItemCategory(DEFAULT_PRODUCT_ITEM_CATEGORY)
            .typeName(DEFAULT_TYPE_NAME)
            .stateEnum(DEFAULT_STATE_ENUM);
        return productItemType;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductItemType createUpdatedEntity(EntityManager em) {
        ProductItemType productItemType = new ProductItemType()
            .productItemCategory(UPDATED_PRODUCT_ITEM_CATEGORY)
            .typeName(UPDATED_TYPE_NAME)
            .stateEnum(UPDATED_STATE_ENUM);
        return productItemType;
    }

    @BeforeEach
    public void initTest() {
        productItemType = createEntity(em);
    }

    @Test
    @Transactional
    void createProductItemType() throws Exception {
        int databaseSizeBeforeCreate = productItemTypeRepository.findAll().size();
        // Create the ProductItemType
        restProductItemTypeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productItemType))
            )
            .andExpect(status().isCreated());

        // Validate the ProductItemType in the database
        List<ProductItemType> productItemTypeList = productItemTypeRepository.findAll();
        assertThat(productItemTypeList).hasSize(databaseSizeBeforeCreate + 1);
        ProductItemType testProductItemType = productItemTypeList.get(productItemTypeList.size() - 1);
        assertThat(testProductItemType.getProductItemCategory()).isEqualTo(DEFAULT_PRODUCT_ITEM_CATEGORY);
        assertThat(testProductItemType.getTypeName()).isEqualTo(DEFAULT_TYPE_NAME);
        assertThat(testProductItemType.getStateEnum()).isEqualTo(DEFAULT_STATE_ENUM);
    }

    @Test
    @Transactional
    void createProductItemTypeWithExistingId() throws Exception {
        // Create the ProductItemType with an existing ID
        productItemType.setId(1L);

        int databaseSizeBeforeCreate = productItemTypeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductItemTypeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productItemType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductItemType in the database
        List<ProductItemType> productItemTypeList = productItemTypeRepository.findAll();
        assertThat(productItemTypeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllProductItemTypes() throws Exception {
        // Initialize the database
        productItemTypeRepository.saveAndFlush(productItemType);

        // Get all the productItemTypeList
        restProductItemTypeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productItemType.getId().intValue())))
            .andExpect(jsonPath("$.[*].productItemCategory").value(hasItem(DEFAULT_PRODUCT_ITEM_CATEGORY.toString())))
            .andExpect(jsonPath("$.[*].typeName").value(hasItem(DEFAULT_TYPE_NAME)))
            .andExpect(jsonPath("$.[*].stateEnum").value(hasItem(DEFAULT_STATE_ENUM.toString())));
    }

    @Test
    @Transactional
    void getProductItemType() throws Exception {
        // Initialize the database
        productItemTypeRepository.saveAndFlush(productItemType);

        // Get the productItemType
        restProductItemTypeMockMvc
            .perform(get(ENTITY_API_URL_ID, productItemType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productItemType.getId().intValue()))
            .andExpect(jsonPath("$.productItemCategory").value(DEFAULT_PRODUCT_ITEM_CATEGORY.toString()))
            .andExpect(jsonPath("$.typeName").value(DEFAULT_TYPE_NAME))
            .andExpect(jsonPath("$.stateEnum").value(DEFAULT_STATE_ENUM.toString()));
    }

    @Test
    @Transactional
    void getNonExistingProductItemType() throws Exception {
        // Get the productItemType
        restProductItemTypeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingProductItemType() throws Exception {
        // Initialize the database
        productItemTypeRepository.saveAndFlush(productItemType);

        int databaseSizeBeforeUpdate = productItemTypeRepository.findAll().size();

        // Update the productItemType
        ProductItemType updatedProductItemType = productItemTypeRepository.findById(productItemType.getId()).get();
        // Disconnect from session so that the updates on updatedProductItemType are not directly saved in db
        em.detach(updatedProductItemType);
        updatedProductItemType.productItemCategory(UPDATED_PRODUCT_ITEM_CATEGORY).typeName(UPDATED_TYPE_NAME).stateEnum(UPDATED_STATE_ENUM);

        restProductItemTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProductItemType.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProductItemType))
            )
            .andExpect(status().isOk());

        // Validate the ProductItemType in the database
        List<ProductItemType> productItemTypeList = productItemTypeRepository.findAll();
        assertThat(productItemTypeList).hasSize(databaseSizeBeforeUpdate);
        ProductItemType testProductItemType = productItemTypeList.get(productItemTypeList.size() - 1);
        assertThat(testProductItemType.getProductItemCategory()).isEqualTo(UPDATED_PRODUCT_ITEM_CATEGORY);
        assertThat(testProductItemType.getTypeName()).isEqualTo(UPDATED_TYPE_NAME);
        assertThat(testProductItemType.getStateEnum()).isEqualTo(UPDATED_STATE_ENUM);
    }

    @Test
    @Transactional
    void putNonExistingProductItemType() throws Exception {
        int databaseSizeBeforeUpdate = productItemTypeRepository.findAll().size();
        productItemType.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductItemTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productItemType.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productItemType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductItemType in the database
        List<ProductItemType> productItemTypeList = productItemTypeRepository.findAll();
        assertThat(productItemTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProductItemType() throws Exception {
        int databaseSizeBeforeUpdate = productItemTypeRepository.findAll().size();
        productItemType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductItemTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productItemType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductItemType in the database
        List<ProductItemType> productItemTypeList = productItemTypeRepository.findAll();
        assertThat(productItemTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProductItemType() throws Exception {
        int databaseSizeBeforeUpdate = productItemTypeRepository.findAll().size();
        productItemType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductItemTypeMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productItemType))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductItemType in the database
        List<ProductItemType> productItemTypeList = productItemTypeRepository.findAll();
        assertThat(productItemTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProductItemTypeWithPatch() throws Exception {
        // Initialize the database
        productItemTypeRepository.saveAndFlush(productItemType);

        int databaseSizeBeforeUpdate = productItemTypeRepository.findAll().size();

        // Update the productItemType using partial update
        ProductItemType partialUpdatedProductItemType = new ProductItemType();
        partialUpdatedProductItemType.setId(productItemType.getId());

        partialUpdatedProductItemType.typeName(UPDATED_TYPE_NAME).stateEnum(UPDATED_STATE_ENUM);

        restProductItemTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductItemType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductItemType))
            )
            .andExpect(status().isOk());

        // Validate the ProductItemType in the database
        List<ProductItemType> productItemTypeList = productItemTypeRepository.findAll();
        assertThat(productItemTypeList).hasSize(databaseSizeBeforeUpdate);
        ProductItemType testProductItemType = productItemTypeList.get(productItemTypeList.size() - 1);
        assertThat(testProductItemType.getProductItemCategory()).isEqualTo(DEFAULT_PRODUCT_ITEM_CATEGORY);
        assertThat(testProductItemType.getTypeName()).isEqualTo(UPDATED_TYPE_NAME);
        assertThat(testProductItemType.getStateEnum()).isEqualTo(UPDATED_STATE_ENUM);
    }

    @Test
    @Transactional
    void fullUpdateProductItemTypeWithPatch() throws Exception {
        // Initialize the database
        productItemTypeRepository.saveAndFlush(productItemType);

        int databaseSizeBeforeUpdate = productItemTypeRepository.findAll().size();

        // Update the productItemType using partial update
        ProductItemType partialUpdatedProductItemType = new ProductItemType();
        partialUpdatedProductItemType.setId(productItemType.getId());

        partialUpdatedProductItemType
            .productItemCategory(UPDATED_PRODUCT_ITEM_CATEGORY)
            .typeName(UPDATED_TYPE_NAME)
            .stateEnum(UPDATED_STATE_ENUM);

        restProductItemTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductItemType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductItemType))
            )
            .andExpect(status().isOk());

        // Validate the ProductItemType in the database
        List<ProductItemType> productItemTypeList = productItemTypeRepository.findAll();
        assertThat(productItemTypeList).hasSize(databaseSizeBeforeUpdate);
        ProductItemType testProductItemType = productItemTypeList.get(productItemTypeList.size() - 1);
        assertThat(testProductItemType.getProductItemCategory()).isEqualTo(UPDATED_PRODUCT_ITEM_CATEGORY);
        assertThat(testProductItemType.getTypeName()).isEqualTo(UPDATED_TYPE_NAME);
        assertThat(testProductItemType.getStateEnum()).isEqualTo(UPDATED_STATE_ENUM);
    }

    @Test
    @Transactional
    void patchNonExistingProductItemType() throws Exception {
        int databaseSizeBeforeUpdate = productItemTypeRepository.findAll().size();
        productItemType.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductItemTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, productItemType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productItemType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductItemType in the database
        List<ProductItemType> productItemTypeList = productItemTypeRepository.findAll();
        assertThat(productItemTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProductItemType() throws Exception {
        int databaseSizeBeforeUpdate = productItemTypeRepository.findAll().size();
        productItemType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductItemTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productItemType))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductItemType in the database
        List<ProductItemType> productItemTypeList = productItemTypeRepository.findAll();
        assertThat(productItemTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProductItemType() throws Exception {
        int databaseSizeBeforeUpdate = productItemTypeRepository.findAll().size();
        productItemType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductItemTypeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productItemType))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductItemType in the database
        List<ProductItemType> productItemTypeList = productItemTypeRepository.findAll();
        assertThat(productItemTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProductItemType() throws Exception {
        // Initialize the database
        productItemTypeRepository.saveAndFlush(productItemType);

        int databaseSizeBeforeDelete = productItemTypeRepository.findAll().size();

        // Delete the productItemType
        restProductItemTypeMockMvc
            .perform(delete(ENTITY_API_URL_ID, productItemType.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProductItemType> productItemTypeList = productItemTypeRepository.findAll();
        assertThat(productItemTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
