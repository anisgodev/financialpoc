package com.bnppf.alphacredit.repositories.productrepository.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bnppf.alphacredit.repositories.productrepository.IntegrationTest;
import com.bnppf.alphacredit.repositories.productrepository.domain.ItemFeature;
import com.bnppf.alphacredit.repositories.productrepository.repository.ItemFeatureRepository;
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
 * Integration tests for the {@link ItemFeatureResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ItemFeatureResourceIT {

    private static final String DEFAULT_FEATURE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FEATURE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_FEATURE_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_FEATURE_LABEL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/item-features";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ItemFeatureRepository itemFeatureRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restItemFeatureMockMvc;

    private ItemFeature itemFeature;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItemFeature createEntity(EntityManager em) {
        ItemFeature itemFeature = new ItemFeature().featureName(DEFAULT_FEATURE_NAME).featureLabel(DEFAULT_FEATURE_LABEL);
        return itemFeature;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ItemFeature createUpdatedEntity(EntityManager em) {
        ItemFeature itemFeature = new ItemFeature().featureName(UPDATED_FEATURE_NAME).featureLabel(UPDATED_FEATURE_LABEL);
        return itemFeature;
    }

    @BeforeEach
    public void initTest() {
        itemFeature = createEntity(em);
    }

    @Test
    @Transactional
    void createItemFeature() throws Exception {
        int databaseSizeBeforeCreate = itemFeatureRepository.findAll().size();
        // Create the ItemFeature
        restItemFeatureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemFeature)))
            .andExpect(status().isCreated());

        // Validate the ItemFeature in the database
        List<ItemFeature> itemFeatureList = itemFeatureRepository.findAll();
        assertThat(itemFeatureList).hasSize(databaseSizeBeforeCreate + 1);
        ItemFeature testItemFeature = itemFeatureList.get(itemFeatureList.size() - 1);
        assertThat(testItemFeature.getFeatureName()).isEqualTo(DEFAULT_FEATURE_NAME);
        assertThat(testItemFeature.getFeatureLabel()).isEqualTo(DEFAULT_FEATURE_LABEL);
    }

    @Test
    @Transactional
    void createItemFeatureWithExistingId() throws Exception {
        // Create the ItemFeature with an existing ID
        itemFeature.setId(1L);

        int databaseSizeBeforeCreate = itemFeatureRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restItemFeatureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemFeature)))
            .andExpect(status().isBadRequest());

        // Validate the ItemFeature in the database
        List<ItemFeature> itemFeatureList = itemFeatureRepository.findAll();
        assertThat(itemFeatureList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllItemFeatures() throws Exception {
        // Initialize the database
        itemFeatureRepository.saveAndFlush(itemFeature);

        // Get all the itemFeatureList
        restItemFeatureMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(itemFeature.getId().intValue())))
            .andExpect(jsonPath("$.[*].featureName").value(hasItem(DEFAULT_FEATURE_NAME)))
            .andExpect(jsonPath("$.[*].featureLabel").value(hasItem(DEFAULT_FEATURE_LABEL)));
    }

    @Test
    @Transactional
    void getItemFeature() throws Exception {
        // Initialize the database
        itemFeatureRepository.saveAndFlush(itemFeature);

        // Get the itemFeature
        restItemFeatureMockMvc
            .perform(get(ENTITY_API_URL_ID, itemFeature.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(itemFeature.getId().intValue()))
            .andExpect(jsonPath("$.featureName").value(DEFAULT_FEATURE_NAME))
            .andExpect(jsonPath("$.featureLabel").value(DEFAULT_FEATURE_LABEL));
    }

    @Test
    @Transactional
    void getNonExistingItemFeature() throws Exception {
        // Get the itemFeature
        restItemFeatureMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingItemFeature() throws Exception {
        // Initialize the database
        itemFeatureRepository.saveAndFlush(itemFeature);

        int databaseSizeBeforeUpdate = itemFeatureRepository.findAll().size();

        // Update the itemFeature
        ItemFeature updatedItemFeature = itemFeatureRepository.findById(itemFeature.getId()).get();
        // Disconnect from session so that the updates on updatedItemFeature are not directly saved in db
        em.detach(updatedItemFeature);
        updatedItemFeature.featureName(UPDATED_FEATURE_NAME).featureLabel(UPDATED_FEATURE_LABEL);

        restItemFeatureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedItemFeature.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedItemFeature))
            )
            .andExpect(status().isOk());

        // Validate the ItemFeature in the database
        List<ItemFeature> itemFeatureList = itemFeatureRepository.findAll();
        assertThat(itemFeatureList).hasSize(databaseSizeBeforeUpdate);
        ItemFeature testItemFeature = itemFeatureList.get(itemFeatureList.size() - 1);
        assertThat(testItemFeature.getFeatureName()).isEqualTo(UPDATED_FEATURE_NAME);
        assertThat(testItemFeature.getFeatureLabel()).isEqualTo(UPDATED_FEATURE_LABEL);
    }

    @Test
    @Transactional
    void putNonExistingItemFeature() throws Exception {
        int databaseSizeBeforeUpdate = itemFeatureRepository.findAll().size();
        itemFeature.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemFeatureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, itemFeature.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemFeature))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemFeature in the database
        List<ItemFeature> itemFeatureList = itemFeatureRepository.findAll();
        assertThat(itemFeatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchItemFeature() throws Exception {
        int databaseSizeBeforeUpdate = itemFeatureRepository.findAll().size();
        itemFeature.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemFeatureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(itemFeature))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemFeature in the database
        List<ItemFeature> itemFeatureList = itemFeatureRepository.findAll();
        assertThat(itemFeatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamItemFeature() throws Exception {
        int databaseSizeBeforeUpdate = itemFeatureRepository.findAll().size();
        itemFeature.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemFeatureMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(itemFeature)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItemFeature in the database
        List<ItemFeature> itemFeatureList = itemFeatureRepository.findAll();
        assertThat(itemFeatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateItemFeatureWithPatch() throws Exception {
        // Initialize the database
        itemFeatureRepository.saveAndFlush(itemFeature);

        int databaseSizeBeforeUpdate = itemFeatureRepository.findAll().size();

        // Update the itemFeature using partial update
        ItemFeature partialUpdatedItemFeature = new ItemFeature();
        partialUpdatedItemFeature.setId(itemFeature.getId());

        partialUpdatedItemFeature.featureLabel(UPDATED_FEATURE_LABEL);

        restItemFeatureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItemFeature.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItemFeature))
            )
            .andExpect(status().isOk());

        // Validate the ItemFeature in the database
        List<ItemFeature> itemFeatureList = itemFeatureRepository.findAll();
        assertThat(itemFeatureList).hasSize(databaseSizeBeforeUpdate);
        ItemFeature testItemFeature = itemFeatureList.get(itemFeatureList.size() - 1);
        assertThat(testItemFeature.getFeatureName()).isEqualTo(DEFAULT_FEATURE_NAME);
        assertThat(testItemFeature.getFeatureLabel()).isEqualTo(UPDATED_FEATURE_LABEL);
    }

    @Test
    @Transactional
    void fullUpdateItemFeatureWithPatch() throws Exception {
        // Initialize the database
        itemFeatureRepository.saveAndFlush(itemFeature);

        int databaseSizeBeforeUpdate = itemFeatureRepository.findAll().size();

        // Update the itemFeature using partial update
        ItemFeature partialUpdatedItemFeature = new ItemFeature();
        partialUpdatedItemFeature.setId(itemFeature.getId());

        partialUpdatedItemFeature.featureName(UPDATED_FEATURE_NAME).featureLabel(UPDATED_FEATURE_LABEL);

        restItemFeatureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedItemFeature.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedItemFeature))
            )
            .andExpect(status().isOk());

        // Validate the ItemFeature in the database
        List<ItemFeature> itemFeatureList = itemFeatureRepository.findAll();
        assertThat(itemFeatureList).hasSize(databaseSizeBeforeUpdate);
        ItemFeature testItemFeature = itemFeatureList.get(itemFeatureList.size() - 1);
        assertThat(testItemFeature.getFeatureName()).isEqualTo(UPDATED_FEATURE_NAME);
        assertThat(testItemFeature.getFeatureLabel()).isEqualTo(UPDATED_FEATURE_LABEL);
    }

    @Test
    @Transactional
    void patchNonExistingItemFeature() throws Exception {
        int databaseSizeBeforeUpdate = itemFeatureRepository.findAll().size();
        itemFeature.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restItemFeatureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, itemFeature.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itemFeature))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemFeature in the database
        List<ItemFeature> itemFeatureList = itemFeatureRepository.findAll();
        assertThat(itemFeatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchItemFeature() throws Exception {
        int databaseSizeBeforeUpdate = itemFeatureRepository.findAll().size();
        itemFeature.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemFeatureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(itemFeature))
            )
            .andExpect(status().isBadRequest());

        // Validate the ItemFeature in the database
        List<ItemFeature> itemFeatureList = itemFeatureRepository.findAll();
        assertThat(itemFeatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamItemFeature() throws Exception {
        int databaseSizeBeforeUpdate = itemFeatureRepository.findAll().size();
        itemFeature.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restItemFeatureMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(itemFeature))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ItemFeature in the database
        List<ItemFeature> itemFeatureList = itemFeatureRepository.findAll();
        assertThat(itemFeatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteItemFeature() throws Exception {
        // Initialize the database
        itemFeatureRepository.saveAndFlush(itemFeature);

        int databaseSizeBeforeDelete = itemFeatureRepository.findAll().size();

        // Delete the itemFeature
        restItemFeatureMockMvc
            .perform(delete(ENTITY_API_URL_ID, itemFeature.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ItemFeature> itemFeatureList = itemFeatureRepository.findAll();
        assertThat(itemFeatureList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
