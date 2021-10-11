import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import SupportCard from '../../components/molecules/SupportCard';

const CallSupport = ({navigation, route}: any) => {
  return (
    <ScrollView>
      <View>
        <Text style={styles.header}>Winnipeg</Text>
        <SupportCard
          title="Mobile Crisis Service (24 hours for Adults)"
          number="204-940-1781"
        />
        <SupportCard
          title="Crisis Stabilization Unit (24 hours for Adults)"
          number="204-940-3633"
        />
        <SupportCard
          title="Klinic Crisis Line (24 hours)"
          number="204-940-1781"
        />
        <SupportCard
          title="Klinic Sexual Assault Crisis Line"
          number="204-786-8686"
        />
        <SupportCard
          title="Manitoba Suicide Prevention and Support Line (24 hours)"
          number="1-877-435-7170"
        />
        <SupportCard
          title="Kids Help Line (National)"
          number="1-800-668-6868"
        />
        <SupportCard
          title="Willow Place Domestic Violence Crisis Line"
          number="204-615-0311"
        />
        <SupportCard
          title="WRHA Community Mental Health Services Intake"
          number="204-788-8330"
        />
        <SupportCard
          title="Canadian Mental Health Association Main Line"
          number="204-982-6100"
        />
        <SupportCard
          title="Canadian Mental Health Association Service Navigation Hub"
          number="204-775-6442"
        />
        <SupportCard
          title="Manitoba Farm, Rural & Northern Support Services"
          number="1-866-367-3274"
        />
        <SupportCard
          title="First Nations and Inuit Hope for Wellness Help Line"
          number="1-855-242-3310"
        />
      </View>
      <View>
        <Text style={styles.header}>Manitoba</Text>
        <SupportCard title="Klinic Crisis Line" number="1-888-322-3019" />
        <SupportCard
          title="Klinic Sexual Assault Crisis Line"
          number="1-888-292-7565"
        />
        <SupportCard
          title="Kids Help Line (National)"
          number="1-800-668-6868"
        />
        <SupportCard
          title="Southern Health Region Crisis Line"
          number="1-888-617-7715"
        />
        <SupportCard
          title="Manitoba Farm, Rural & Northern Support Services"
          number="1-866-367-3274"
        />
        <SupportCard
          title="First Nations and Inuit Hope for Wellness Help Line"
          number="1-855-242-3310"
        />
        <SupportCard
          title="Interlake-Eastern Manitoba Health Crisis Line (24 hours)"
          number="1-866-427-8628"
        />
        <SupportCard
          title="Northern Health Region Crisis Line"
          number="1-866-242-1571"
        />
        <SupportCard
          title="Prairie Mountain Health Region Crisis Line"
          number="1-888-379-7699"
        />
      </View>
      <View>
        <Text style={styles.header}>National Crisis Phone Numbers</Text>
        <SupportCard
          title="Canada Suicide Prevention Services"
          number="1-833-456-4566"
        />
        <SupportCard
          title="Canada Suicide Prevention Services"
          number="thelifelinecanada.ca"
          type="email"
        />
        <SupportCard
          title="Kids Help Phone (20 years of age and under)"
          number="1-800-668-6868"
        />
        <SupportCard
          title="First Nations and Inuit Hope for Wellness Help Line"
          number="1-855-242-3310"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 25,
  },
});

export default CallSupport;
