package com.bnppf.alphacredit.creditproductdesigner.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.bnppf.alphacredit.creditproductdesigner.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CreditProductTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CreditProduct.class);
        CreditProduct creditProduct1 = new CreditProduct();
        creditProduct1.setId("id1");
        CreditProduct creditProduct2 = new CreditProduct();
        creditProduct2.setId(creditProduct1.getId());
        assertThat(creditProduct1).isEqualTo(creditProduct2);
        creditProduct2.setId("id2");
        assertThat(creditProduct1).isNotEqualTo(creditProduct2);
        creditProduct1.setId(null);
        assertThat(creditProduct1).isNotEqualTo(creditProduct2);
    }
}
