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
    textDecoration: 'underline',
  },
  icon: {
    alignSelf: 'flex-end',
    marginRight: 3,
    width: 13,
    height: 13,
  },
});
