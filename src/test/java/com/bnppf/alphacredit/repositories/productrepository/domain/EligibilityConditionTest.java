package com.bnppf.alphacredit.repositories.productrepository.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.bnppf.alphacredit.repositories.productrepository.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EligibilityConditionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EligibilityCondition.class);
        EligibilityCondition eligibilityCondition1 = new EligibilityCondition();
        eligibilityCondition1.setId(1L);
        EligibilityCondition eligibilityCondition2 = new EligibilityCondition();
        eligibilityCondition2.setId(eligibilityCondition1.getId());
        assertThat(eligibilityCondition1).isEqualTo(eligibilityCondition2);
        eligibilityCondition2.setId(2L);
        assertThat(eligibilityCondition1).isNotEqualTo(eligibilityCondition2);
        eligibilityCondition1.setId(null);
        assertThat(eligibilityCondition1).isNotEqualTo(eligibilityCondition2);
    }
}
