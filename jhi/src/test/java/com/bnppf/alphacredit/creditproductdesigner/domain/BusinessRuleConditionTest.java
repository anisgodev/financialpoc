package com.bnppf.alphacredit.creditproductdesigner.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.bnppf.alphacredit.creditproductdesigner.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BusinessRuleConditionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BusinessRuleCondition.class);
        BusinessRuleCondition businessRuleCondition1 = new BusinessRuleCondition();
        businessRuleCondition1.setId("id1");
        BusinessRuleCondition businessRuleCondition2 = new BusinessRuleCondition();
        businessRuleCondition2.setId(businessRuleCondition1.getId());
        assertThat(businessRuleCondition1).isEqualTo(businessRuleCondition2);
        businessRuleCondition2.setId("id2");
        assertThat(businessRuleCondition1).isNotEqualTo(businessRuleCondition2);
        businessRuleCondition1.setId(null);
        assertThat(businessRuleCondition1).isNotEqualTo(businessRuleCondition2);
    }
}
