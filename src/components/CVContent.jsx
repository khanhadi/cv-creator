import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

export default function CVContent({ resumeData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>
            {resumeData.firstName} {resumeData.lastName}
          </Text>
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
    width: '168mm',
    height: '237.6mm',
    margin: '10px',
  },
  section: {
    margin: 10,
    padding: 10,
  },
});
