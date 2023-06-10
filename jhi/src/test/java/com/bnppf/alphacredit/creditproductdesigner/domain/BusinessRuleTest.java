package com.bnppf.alphacredit.creditproductdesigner.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.bnppf.alphacredit.creditproductdesigner.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BusinessRuleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BusinessRule.class);
        BusinessRule businessRule1 = new BusinessRule();
        businessRule1.setId("id1");
        BusinessRule businessRule2 = new BusinessRule();
        businessRule2.setId(businessRule1.getId());
        assertThat(businessRule1).isEqualTo(businessRule2);
        businessRule2.setId("id2");
        assertThat(businessRule1).isNotEqualTo(businessRule2);
        businessRule1.setId(null);
        assertThat(businessRule1).isNotEqualTo(businessRule2);
    }
}
