package com.bnppf.alphacredit.creditproductdesigner.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.bnppf.alphacredit.creditproductdesigner.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BusinessModelTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BusinessModel.class);
        BusinessModel businessModel1 = new BusinessModel();
        businessModel1.setId("id1");
        BusinessModel businessModel2 = new BusinessModel();
        businessModel2.setId(businessModel1.getId());
        assertThat(businessModel1).isEqualTo(businessModel2);
        businessModel2.setId("id2");
        assertThat(businessModel1).isNotEqualTo(businessModel2);
        businessModel1.setId(null);
        assertThat(businessModel1).isNotEqualTo(businessModel2);
    }
}
