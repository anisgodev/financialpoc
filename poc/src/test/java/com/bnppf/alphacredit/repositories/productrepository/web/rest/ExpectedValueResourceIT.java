package com.bnppf.alphacredit.repositories.productrepository.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bnppf.alphacredit.repositories.productrepository.IntegrationTest;
import com.bnppf.alphacredit.repositories.productrepository.domain.ExpectedValue;
import com.bnppf.alphacredit.repositories.productrepository.domain.enumeration.ParameterTypeEnum;
import com.bnppf.alphacredit.repositories.productrepository.repository.ExpectedValueRepository;
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
 * Integration tests for the {@link ExpectedValueResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ExpectedValueResourceIT {

    private static final ParameterTypeEnum DEFAULT_PARAMETER_TYPE_ENUM = ParameterTypeEnum.BIGDECIMAL;
    private static final ParameterTypeEnum UPDATED_PARAMETER_TYPE_ENUM = ParameterTypeEnum.BIGINTEGER;

    private static final String DEFAULT_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_VALUE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/expected-values";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ExpectedValueRepository expectedValueRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restExpectedValueMockMvc;

    private ExpectedValue expectedValue;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExpectedValue createEntity(EntityManager em) {
        ExpectedValue expectedValue = new ExpectedValue().parameterTypeEnum(DEFAULT_PARAMETER_TYPE_ENUM).value(DEFAULT_VALUE);
        return expectedValue;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExpectedValue createUpdatedEntity(EntityManager em) {
        ExpectedValue expectedValue = new ExpectedValue().parameterTypeEnum(UPDATED_PARAMETER_TYPE_ENUM).value(UPDATED_VALUE);
        return expectedValue;
    }

    @BeforeEach
    public void initTest() {
        expectedValue = createEntity(em);
    }

    @Test
    @Transactional
    void createExpectedValue() throws Exception {
        int databaseSizeBeforeCreate = expectedValueRepository.findAll().size();
        // Create the ExpectedValue
        restExpectedValueMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(expectedValue)))
            .andExpect(status().isCreated());

        // Validate the ExpectedValue in the database
        List<ExpectedValue> expectedValueList = expectedValueRepository.findAll();
        assertThat(expectedValueList).hasSize(databaseSizeBeforeCreate + 1);
        ExpectedValue testExpectedValue = expectedValueList.get(expectedValueList.size() - 1);
        assertThat(testExpectedValue.getParameterTypeEnum()).isEqualTo(DEFAULT_PARAMETER_TYPE_ENUM);
        assertThat(testExpectedValue.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    @Transactional
    void createExpectedValueWithExistingId() throws Exception {
        // Create the ExpectedValue with an existing ID
        expectedValue.setId(1L);

        int databaseSizeBeforeCreate = expectedValueRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restExpectedValueMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(expectedValue)))
            .andExpect(status().isBadRequest());

        // Validate the ExpectedValue in the database
        List<ExpectedValue> expectedValueList = expectedValueRepository.findAll();
        assertThat(expectedValueList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllExpectedValues() throws Exception {
        // Initialize the database
        expectedValueRepository.saveAndFlush(expectedValue);

        // Get all the expectedValueList
        restExpectedValueMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(expectedValue.getId().intValue())))
            .andExpect(jsonPath("$.[*].parameterTypeEnum").value(hasItem(DEFAULT_PARAMETER_TYPE_ENUM.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE)));
    }

    @Test
    @Transactional
    void getExpectedValue() throws Exception {
        // Initialize the database
        expectedValueRepository.saveAndFlush(expectedValue);

        // Get the expectedValue
        restExpectedValueMockMvc
            .perform(get(ENTITY_API_URL_ID, expectedValue.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(expectedValue.getId().intValue()))
            .andExpect(jsonPath("$.parameterTypeEnum").value(DEFAULT_PARAMETER_TYPE_ENUM.toString()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE));
    }

    @Test
    @Transactional
    void getNonExistingExpectedValue() throws Exception {
        // Get the expectedValue
        restExpectedValueMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingExpectedValue() throws Exception {
        // Initialize the database
        expectedValueRepository.saveAndFlush(expectedValue);

        int databaseSizeBeforeUpdate = expectedValueRepository.findAll().size();

        // Update the expectedValue
        ExpectedValue updatedExpectedValue = expectedValueRepository.findById(expectedValue.getId()).get();
        // Disconnect from session so that the updates on updatedExpectedValue are not directly saved in db
        em.detach(updatedExpectedValue);
        updatedExpectedValue.parameterTypeEnum(UPDATED_PARAMETER_TYPE_ENUM).value(UPDATED_VALUE);

        restExpectedValueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedExpectedValue.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedExpectedValue))
            )
            .andExpect(status().isOk());

        // Validate the ExpectedValue in the database
        List<ExpectedValue> expectedValueList = expectedValueRepository.findAll();
        assertThat(expectedValueList).hasSize(databaseSizeBeforeUpdate);
        ExpectedValue testExpectedValue = expectedValueList.get(expectedValueList.size() - 1);
        assertThat(testExpectedValue.getParameterTypeEnum()).isEqualTo(UPDATED_PARAMETER_TYPE_ENUM);
        assertThat(testExpectedValue.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void putNonExistingExpectedValue() throws Exception {
        int databaseSizeBeforeUpdate = expectedValueRepository.findAll().size();
        expectedValue.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExpectedValueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, expectedValue.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(expectedValue))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExpectedValue in the database
        List<ExpectedValue> expectedValueList = expectedValueRepository.findAll();
        assertThat(expectedValueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchExpectedValue() throws Exception {
        int databaseSizeBeforeUpdate = expectedValueRepository.findAll().size();
        expectedValue.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExpectedValueMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(expectedValue))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExpectedValue in the database
        List<ExpectedValue> expectedValueList = expectedValueRepository.findAll();
        assertThat(expectedValueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamExpectedValue() throws Exception {
        int databaseSizeBeforeUpdate = expectedValueRepository.findAll().size();
        expectedValue.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExpectedValueMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(expectedValue)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExpectedValue in the database
        List<ExpectedValue> expectedValueList = expectedValueRepository.findAll();
        assertThat(expectedValueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateExpectedValueWithPatch() throws Exception {
        // Initialize the database
        expectedValueRepository.saveAndFlush(expectedValue);

        int databaseSizeBeforeUpdate = expectedValueRepository.findAll().size();

        // Update the expectedValue using partial update
        ExpectedValue partialUpdatedExpectedValue = new ExpectedValue();
        partialUpdatedExpectedValue.setId(expectedValue.getId());

        restExpectedValueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExpectedValue.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExpectedValue))
            )
            .andExpect(status().isOk());

        // Validate the ExpectedValue in the database
        List<ExpectedValue> expectedValueList = expectedValueRepository.findAll();
        assertThat(expectedValueList).hasSize(databaseSizeBeforeUpdate);
        ExpectedValue testExpectedValue = expectedValueList.get(expectedValueList.size() - 1);
        assertThat(testExpectedValue.getParameterTypeEnum()).isEqualTo(DEFAULT_PARAMETER_TYPE_ENUM);
        assertThat(testExpectedValue.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    @Transactional
    void fullUpdateExpectedValueWithPatch() throws Exception {
        // Initialize the database
        expectedValueRepository.saveAndFlush(expectedValue);

        int databaseSizeBeforeUpdate = expectedValueRepository.findAll().size();

        // Update the expectedValue using partial update
        ExpectedValue partialUpdatedExpectedValue = new ExpectedValue();
        partialUpdatedExpectedValue.setId(expectedValue.getId());

        partialUpdatedExpectedValue.parameterTypeEnum(UPDATED_PARAMETER_TYPE_ENUM).value(UPDATED_VALUE);

        restExpectedValueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedExpectedValue.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedExpectedValue))
            )
            .andExpect(status().isOk());

        // Validate the ExpectedValue in the database
        List<ExpectedValue> expectedValueList = expectedValueRepository.findAll();
        assertThat(expectedValueList).hasSize(databaseSizeBeforeUpdate);
        ExpectedValue testExpectedValue = expectedValueList.get(expectedValueList.size() - 1);
        assertThat(testExpectedValue.getParameterTypeEnum()).isEqualTo(UPDATED_PARAMETER_TYPE_ENUM);
        assertThat(testExpectedValue.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void patchNonExistingExpectedValue() throws Exception {
        int databaseSizeBeforeUpdate = expectedValueRepository.findAll().size();
        expectedValue.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restExpectedValueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, expectedValue.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(expectedValue))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExpectedValue in the database
        List<ExpectedValue> expectedValueList = expectedValueRepository.findAll();
        assertThat(expectedValueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchExpectedValue() throws Exception {
        int databaseSizeBeforeUpdate = expectedValueRepository.findAll().size();
        expectedValue.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExpectedValueMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(expectedValue))
            )
            .andExpect(status().isBadRequest());

        // Validate the ExpectedValue in the database
        List<ExpectedValue> expectedValueList = expectedValueRepository.findAll();
        assertThat(expectedValueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamExpectedValue() throws Exception {
        int databaseSizeBeforeUpdate = expectedValueRepository.findAll().size();
        expectedValue.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restExpectedValueMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(expectedValue))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ExpectedValue in the database
        List<ExpectedValue> expectedValueList = expectedValueRepository.findAll();
        assertThat(expectedValueList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteExpectedValue() throws Exception {
        // Initialize the database
        expectedValueRepository.saveAndFlush(expectedValue);

        int databaseSizeBeforeDelete = expectedValueRepository.findAll().size();

        // Delete the expectedValue
        restExpectedValueMockMvc
            .perform(delete(ENTITY_API_URL_ID, expectedValue.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ExpectedValue> expectedValueList = expectedValueRepository.findAll();
        assertThat(expectedValueList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
