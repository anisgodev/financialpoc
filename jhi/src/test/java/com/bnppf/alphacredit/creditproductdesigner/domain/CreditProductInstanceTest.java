package com.bnppf.alphacredit.creditproductdesigner.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.bnppf.alphacredit.creditproductdesigner.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CreditProductInstanceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CreditProductInstance.class);
        CreditProductInstance creditProductInstance1 = new CreditProductInstance();
        creditProductInstance1.setId("id1");
        CreditProductInstance creditProductInstance2 = new CreditProductInstance();
        creditProductInstance2.setId(creditProductInstance1.getId());
        assertThat(creditProductInstance1).isEqualTo(creditProductInstance2);
        creditProductInstance2.setId("id2");
        assertThat(creditProductInstance1).isNotEqualTo(creditProductInstance2);
        creditProductInstance1.setId(null);
        assertThat(creditProductInstance1).isNotEqualTo(creditProductInstance2);
    }
}
