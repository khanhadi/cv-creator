import {
  Page,
  Image,
  Text,
  Link,
  View,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';
import emailIcon from '../assets/icons/cv-icons/email.png';
import phoneIcon from '../assets/icons/cv-icons/phone.png';
import linkedinIcon from '../assets/icons/cv-icons/linkedin.png';
import xIcon from '../assets/icons/cv-icons/x.png';

export default function CVContent({ resumeData, selectedSocial }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.fullName}>{resumeData.fullName}</Text>
        </View>
        <View style={styles.contact}>
          <Image src={emailIcon} style={styles.icon}></Image>
          <Text style={styles.contactItem}>{resumeData.email}</Text>
          <Image src={phoneIcon} style={styles.icon}></Image>
          <Text style={styles.contactItem}>{resumeData.mobileNo}</Text>
          <Image
            src={selectedSocial == 'linkedin' ? linkedinIcon : xIcon}
            style={styles.icon}
          ></Image>
          <Text style={styles.contactItem}>
            <Link src={resumeData.socialLink}></Link>
            {resumeData.socialLink}
          </Text>
        </View>
        <View style={styles.hrContainer}>
          <Text style={styles.subTitle}>Education</Text>
          <View style={styles.hr} />
        </View>
        <View className="self-start mt-3">
          <div className="self-start">
            <div className="flex justify-between">
              <p className="font-semibold text-sm">University of Leeds</p>
              <p className="text-rose-950 text-sm">
                Expected graduation date: Jun. 2026
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-rose-950 text-sm leading-3">
                B.Sc (Hons) in Computer Science
              </p>
              <p className="text-rose-950 text-sm italic font-bold">
                Predicted: First Class (1:1)
              </p>
            </div>
            <p className="text-sm">
              Relevant Courses: Procedural Programming (C), Fundamental
              Mathematics, Computer Architecture and Professional Computing
            </p>
          </div>
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
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 30,
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
    textDecoration: 'underline',
  },
  icon: {
    alignSelf: 'flex-end',
    marginRight: 3,
    width: 13,
    height: 13,
  },
  subTitle: {
    marginTop: 12,
  },
  hrContainer: {
    width: '100%',
  },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
});
