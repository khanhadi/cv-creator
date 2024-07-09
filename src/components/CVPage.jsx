import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

export default function CVPage({ resumeData }) {
  return (
    // <div className="cv-page h-[90%] w-11/12 max-w-full flex justify-center shadow-2xl bg-white">
    //   <h1>
    //     {resumeData.firstName} {resumeData.lastName}
    //   </h1>
    // </div>
    <div className="shadow-2xl">
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>
              {resumeData.firstName} {resumeData.lastName}
            </Text>
          </View>
        </Page>
      </Document>
    </div>
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
