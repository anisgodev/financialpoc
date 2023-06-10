package com.bnppf.alphacredit.creditproductdesigner.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.bnppf.alphacredit.creditproductdesigner.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SimulationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Simulation.class);
        Simulation simulation1 = new Simulation();
        simulation1.setId("id1");
        Simulation simulation2 = new Simulation();
        simulation2.setId(simulation1.getId());
        assertThat(simulation1).isEqualTo(simulation2);
        simulation2.setId("id2");
        assertThat(simulation1).isNotEqualTo(simulation2);
        simulation1.setId(null);
        assertThat(simulation1).isNotEqualTo(simulation2);
    }
}
