package com.bnppf.alphacredit.repositories.productrepository.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bnppf.alphacredit.repositories.productrepository.IntegrationTest;
import com.bnppf.alphacredit.repositories.productrepository.domain.EligibilityCondition;
import com.bnppf.alphacredit.repositories.productrepository.domain.enumeration.ApplyLevelEnum;
import com.bnppf.alphacredit.repositories.productrepository.repository.EligibilityConditionRepository;
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
 * Integration tests for the {@link EligibilityConditionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EligibilityConditionResourceIT {

    private static final ApplyLevelEnum DEFAULT_APPLY_LEVEL_ENUM = ApplyLevelEnum.ITEM;
    private static final ApplyLevelEnum UPDATED_APPLY_LEVEL_ENUM = ApplyLevelEnum.FEATURE;

    private static final String ENTITY_API_URL = "/api/eligibility-conditions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EligibilityConditionRepository eligibilityConditionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEligibilityConditionMockMvc;

    private EligibilityCondition eligibilityCondition;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EligibilityCondition createEntity(EntityManager em) {
        EligibilityCondition eligibilityCondition = new EligibilityCondition().applyLevelEnum(DEFAULT_APPLY_LEVEL_ENUM);
        return eligibilityCondition;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EligibilityCondition createUpdatedEntity(EntityManager em) {
        EligibilityCondition eligibilityCondition = new EligibilityCondition().applyLevelEnum(UPDATED_APPLY_LEVEL_ENUM);
        return eligibilityCondition;
    }

    @BeforeEach
    public void initTest() {
        eligibilityCondition = createEntity(em);
    }

    @Test
    @Transactional
    void createEligibilityCondition() throws Exception {
        int databaseSizeBeforeCreate = eligibilityConditionRepository.findAll().size();
        // Create the EligibilityCondition
        restEligibilityConditionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eligibilityCondition))
            )
            .andExpect(status().isCreated());

        // Validate the EligibilityCondition in the database
        List<EligibilityCondition> eligibilityConditionList = eligibilityConditionRepository.findAll();
        assertThat(eligibilityConditionList).hasSize(databaseSizeBeforeCreate + 1);
        EligibilityCondition testEligibilityCondition = eligibilityConditionList.get(eligibilityConditionList.size() - 1);
        assertThat(testEligibilityCondition.getApplyLevelEnum()).isEqualTo(DEFAULT_APPLY_LEVEL_ENUM);
    }

    @Test
    @Transactional
    void createEligibilityConditionWithExistingId() throws Exception {
        // Create the EligibilityCondition with an existing ID
        eligibilityCondition.setId(1L);

        int databaseSizeBeforeCreate = eligibilityConditionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEligibilityConditionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eligibilityCondition))
            )
            .andExpect(status().isBadRequest());

        // Validate the EligibilityCondition in the database
        List<EligibilityCondition> eligibilityConditionList = eligibilityConditionRepository.findAll();
        assertThat(eligibilityConditionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEligibilityConditions() throws Exception {
        // Initialize the database
        eligibilityConditionRepository.saveAndFlush(eligibilityCondition);

        // Get all the eligibilityConditionList
        restEligibilityConditionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eligibilityCondition.getId().intValue())))
            .andExpect(jsonPath("$.[*].applyLevelEnum").value(hasItem(DEFAULT_APPLY_LEVEL_ENUM.toString())));
    }

    @Test
    @Transactional
    void getEligibilityCondition() throws Exception {
        // Initialize the database
        eligibilityConditionRepository.saveAndFlush(eligibilityCondition);

        // Get the eligibilityCondition
        restEligibilityConditionMockMvc
            .perform(get(ENTITY_API_URL_ID, eligibilityCondition.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(eligibilityCondition.getId().intValue()))
            .andExpect(jsonPath("$.applyLevelEnum").value(DEFAULT_APPLY_LEVEL_ENUM.toString()));
    }

    @Test
    @Transactional
    void getNonExistingEligibilityCondition() throws Exception {
        // Get the eligibilityCondition
        restEligibilityConditionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEligibilityCondition() throws Exception {
        // Initialize the database
        eligibilityConditionRepository.saveAndFlush(eligibilityCondition);

        int databaseSizeBeforeUpdate = eligibilityConditionRepository.findAll().size();

        // Update the eligibilityCondition
        EligibilityCondition updatedEligibilityCondition = eligibilityConditionRepository.findById(eligibilityCondition.getId()).get();
        // Disconnect from session so that the updates on updatedEligibilityCondition are not directly saved in db
        em.detach(updatedEligibilityCondition);
        updatedEligibilityCondition.applyLevelEnum(UPDATED_APPLY_LEVEL_ENUM);

        restEligibilityConditionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEligibilityCondition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEligibilityCondition))
            )
            .andExpect(status().isOk());

        // Validate the EligibilityCondition in the database
        List<EligibilityCondition> eligibilityConditionList = eligibilityConditionRepository.findAll();
        assertThat(eligibilityConditionList).hasSize(databaseSizeBeforeUpdate);
        EligibilityCondition testEligibilityCondition = eligibilityConditionList.get(eligibilityConditionList.size() - 1);
        assertThat(testEligibilityCondition.getApplyLevelEnum()).isEqualTo(UPDATED_APPLY_LEVEL_ENUM);
    }

    @Test
    @Transactional
    void putNonExistingEligibilityCondition() throws Exception {
        int databaseSizeBeforeUpdate = eligibilityConditionRepository.findAll().size();
        eligibilityCondition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEligibilityConditionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, eligibilityCondition.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eligibilityCondition))
            )
            .andExpect(status().isBadRequest());

        // Validate the EligibilityCondition in the database
        List<EligibilityCondition> eligibilityConditionList = eligibilityConditionRepository.findAll();
        assertThat(eligibilityConditionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEligibilityCondition() throws Exception {
        int databaseSizeBeforeUpdate = eligibilityConditionRepository.findAll().size();
        eligibilityCondition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEligibilityConditionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(eligibilityCondition))
            )
            .andExpect(status().isBadRequest());

        // Validate the EligibilityCondition in the database
        List<EligibilityCondition> eligibilityConditionList = eligibilityConditionRepository.findAll();
        assertThat(eligibilityConditionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEligibilityCondition() throws Exception {
        int databaseSizeBeforeUpdate = eligibilityConditionRepository.findAll().size();
        eligibilityCondition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEligibilityConditionMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(eligibilityCondition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EligibilityCondition in the database
        List<EligibilityCondition> eligibilityConditionList = eligibilityConditionRepository.findAll();
        assertThat(eligibilityConditionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEligibilityConditionWithPatch() throws Exception {
        // Initialize the database
        eligibilityConditionRepository.saveAndFlush(eligibilityCondition);

        int databaseSizeBeforeUpdate = eligibilityConditionRepository.findAll().size();

        // Update the eligibilityCondition using partial update
        EligibilityCondition partialUpdatedEligibilityCondition = new EligibilityCondition();
        partialUpdatedEligibilityCondition.setId(eligibilityCondition.getId());

        partialUpdatedEligibilityCondition.applyLevelEnum(UPDATED_APPLY_LEVEL_ENUM);

        restEligibilityConditionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEligibilityCondition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEligibilityCondition))
            )
            .andExpect(status().isOk());

        // Validate the EligibilityCondition in the database
        List<EligibilityCondition> eligibilityConditionList = eligibilityConditionRepository.findAll();
        assertThat(eligibilityConditionList).hasSize(databaseSizeBeforeUpdate);
        EligibilityCondition testEligibilityCondition = eligibilityConditionList.get(eligibilityConditionList.size() - 1);
        assertThat(testEligibilityCondition.getApplyLevelEnum()).isEqualTo(UPDATED_APPLY_LEVEL_ENUM);
    }

    @Test
    @Transactional
    void fullUpdateEligibilityConditionWithPatch() throws Exception {
        // Initialize the database
        eligibilityConditionRepository.saveAndFlush(eligibilityCondition);

        int databaseSizeBeforeUpdate = eligibilityConditionRepository.findAll().size();

        // Update the eligibilityCondition using partial update
        EligibilityCondition partialUpdatedEligibilityCondition = new EligibilityCondition();
        partialUpdatedEligibilityCondition.setId(eligibilityCondition.getId());

        partialUpdatedEligibilityCondition.applyLevelEnum(UPDATED_APPLY_LEVEL_ENUM);

        restEligibilityConditionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEligibilityCondition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEligibilityCondition))
            )
            .andExpect(status().isOk());

        // Validate the EligibilityCondition in the database
        List<EligibilityCondition> eligibilityConditionList = eligibilityConditionRepository.findAll();
        assertThat(eligibilityConditionList).hasSize(databaseSizeBeforeUpdate);
        EligibilityCondition testEligibilityCondition = eligibilityConditionList.get(eligibilityConditionList.size() - 1);
        assertThat(testEligibilityCondition.getApplyLevelEnum()).isEqualTo(UPDATED_APPLY_LEVEL_ENUM);
    }

    @Test
    @Transactional
    void patchNonExistingEligibilityCondition() throws Exception {
        int databaseSizeBeforeUpdate = eligibilityConditionRepository.findAll().size();
        eligibilityCondition.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEligibilityConditionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, eligibilityCondition.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eligibilityCondition))
            )
            .andExpect(status().isBadRequest());

        // Validate the EligibilityCondition in the database
        List<EligibilityCondition> eligibilityConditionList = eligibilityConditionRepository.findAll();
        assertThat(eligibilityConditionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEligibilityCondition() throws Exception {
        int databaseSizeBeforeUpdate = eligibilityConditionRepository.findAll().size();
        eligibilityCondition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEligibilityConditionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eligibilityCondition))
            )
            .andExpect(status().isBadRequest());

        // Validate the EligibilityCondition in the database
        List<EligibilityCondition> eligibilityConditionList = eligibilityConditionRepository.findAll();
        assertThat(eligibilityConditionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEligibilityCondition() throws Exception {
        int databaseSizeBeforeUpdate = eligibilityConditionRepository.findAll().size();
        eligibilityCondition.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEligibilityConditionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(eligibilityCondition))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EligibilityCondition in the database
        List<EligibilityCondition> eligibilityConditionList = eligibilityConditionRepository.findAll();
        assertThat(eligibilityConditionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEligibilityCondition() throws Exception {
        // Initialize the database
        eligibilityConditionRepository.saveAndFlush(eligibilityCondition);

        int databaseSizeBeforeDelete = eligibilityConditionRepository.findAll().size();

        // Delete the eligibilityCondition
        restEligibilityConditionMockMvc
            .perform(delete(ENTITY_API_URL_ID, eligibilityCondition.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EligibilityCondition> eligibilityConditionList = eligibilityConditionRepository.findAll();
        assertThat(eligibilityConditionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
