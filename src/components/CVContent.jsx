import {
  Page,
  Image,
  Text,
  View,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';

export default function CVContent({ resumeData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.fullName}>{resumeData.fullName}</Text>
        </View>
        <View style={styles.contact}>
          <Image src="" style={styles.icon}></Image>
          <Text style={styles.contactItem}>{resumeData.email}</Text>
          <Text style={styles.contactItem}>{resumeData.mobileNo}</Text>
          <Text>{resumeData.socialLink}</Text>
        </View>
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: '10px',
    fontSize: '16',
  },
  fullName: {
    fontSize: '30',
  },
  contact: {
    fontSize: '12',
    display: 'flex',
    flexDirection: 'row',
  },
  contactItem: {
    marginRight: '8px',
  },
  icon: {
    alignSelf: 'center',
    marginRight: 3,
    width: 10,
    height: 10,
  },
});
