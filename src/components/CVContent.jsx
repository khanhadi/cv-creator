import {
  Page,
  Image,
  Text,
  Link,
  View,
  Document,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import emailIcon from '../assets/icons/cv-icons/email.png';
import phoneIcon from '../assets/icons/cv-icons/phone.png';
import linkedinIcon from '../assets/icons/cv-icons/linkedin.png';
import githubIcon from '../assets/icons/cv-icons/github.png';
import xIcon from '../assets/icons/cv-icons/x.png';
import linkIcon from '../assets/icons/cv-icons/link.png';
import CVFormatText from '../utils/CVFormatText';

Font.register({
  family: 'Proxima Nova',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/font-proxima-nova@1.0.1/fonts/ProximaNova-Regular.woff',
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/font-proxima-nova@1.0.1/fonts/ProximaNova-Semibold.woff',
      fontWeight: 'semibold',
    },
  ],
});

export default function CVContent({
  resumeData,
  selectedSocial,
  sectionsOrder,
}) {
  const sectionsToRender = sectionsOrder.filter(
    (section) => resumeData.includeSections[section]
  );

  const getCustomSectionData = (customSectionData, sectionTitle) => {
    const existingSection = customSectionData.find(
      (section) => section.title === sectionTitle
    );
    return existingSection;
  };

  const getSocialIcon = (selectedSocial) => {
    switch (selectedSocial) {
      case 'linkedin':
        return linkedinIcon;
      case 'github':
        return githubIcon;
      case 'twitter':
        return xIcon;
      default:
        return linkedinIcon; // Default to LinkedIn if no valid option is selected
    }
  };

  function renderSection(sectionName) {
    switch (sectionName) {
      case 'education':
        return (
          <View>
            <View>{renderSectionHeader('Education')}</View>
            {resumeData.educationList.map((education, index) => (
              <View key={index}>
                <View style={styles.section}>
                  <View style={styles.sectionSplit}>
                    <Text style={styles.leftTitle}>
                      {education.institutionName}
                    </Text>
                    <Text style={styles.rightTitle}>{education.date}</Text>
                  </View>
                  <View style={styles.sectionSplit}>
                    <Text style={styles.rightTitle}>
                      {education.courseTitle}
                    </Text>
                    <Text style={styles.rightTitleBold}>{education.grade}</Text>
                  </View>
                  <CVFormatText text={education.description}></CVFormatText>
                </View>
              </View>
            ))}
          </View>
        );

      case 'professionalExperience':
        return (
          <View>
            <View>{renderSectionHeader('Professional Experience')}</View>
            {resumeData.experienceList.map((experience, index) => (
              <View key={index}>
                <View style={styles.section}>
                  <View style={styles.sectionSplit}>
                    <Text style={styles.leftTitle}>
                      {experience.companyName}
                    </Text>
                    <Text style={styles.rightTitle}>{experience.date}</Text>
                  </View>
                  <View style={styles.sectionSplit}>
                    <Text style={styles.rightTitle}>{experience.jobTitle}</Text>
                    <Text style={styles.rightTitleBold}>
                      {experience.skills.join(', ')}
                    </Text>
                  </View>
                  <CVFormatText text={experience.description}></CVFormatText>
                </View>
              </View>
            ))}
          </View>
        );

      case 'projects':
        return (
          <View>
            <View>{renderSectionHeader('Projects')}</View>
            {resumeData.projectsList.map((project, index) => (
              <View key={index}>
                <View style={styles.section}>
                  <View style={styles.sectionSplit}>
                    <View style={styles.flex}>
                      <Text style={styles.leftTitle}>
                        {project.link !== '' ? (
                          <Link style={styles.link} src={project.link}>
                            {project.projectName}
                          </Link>
                        ) : (
                          project.projectName
                        )}
                      </Text>
                      {project.link !== '' ? (
                        <Image src={linkIcon} style={styles.linkIcon}></Image>
                      ) : null}
                    </View>
                    <Text style={styles.rightTitle}>{project.date}</Text>
                  </View>
                  <View style={styles.sectionSplit}>
                    <Text style={styles.rightTitle}>{project.subHeading}</Text>
                    {/* <Text style={styles.rightTitleBold}>
                      {project.skills.join(', ')}
                    </Text> */}
                  </View>
                  <CVFormatText text={project.description}></CVFormatText>
                </View>
              </View>
            ))}
          </View>
        );

      default: {
        // Handle custom sections
        const customSection = sectionsToRender.find(
          (section) => section === sectionName
        );

        if (customSection) {
          const sectionData = getCustomSectionData(
            resumeData.customSectionData,
            customSection
          );
          return (
            <View>
              <View>{renderSectionHeader(customSection)}</View>
              {sectionData?.items.map((item, index) => (
                <View key={index}>
                  <View style={styles.section}>
                    <View style={styles.sectionSplit}>
                      <Text style={styles.leftTitle}>{item.heading}</Text>
                      <Text style={styles.rightTitle}>{item.date}</Text>
                    </View>
                    <View style={styles.sectionSplit}>
                      <Text style={styles.rightTitle}>{item.subHeading}</Text>
                      <Text style={styles.rightTitleBold}>
                        {item.additionalInfo}
                      </Text>
                    </View>
                    <CVFormatText text={item.description}></CVFormatText>
                  </View>
                </View>
              ))}
            </View>
          );
        }
      }
    }
  }

  function renderSectionHeader(title) {
    return (
      <View style={styles.hrContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.hr} />
      </View>
    );
  }

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
            src={getSocialIcon(selectedSocial)}
            style={styles.icon}
          ></Image>
          <Text style={styles.contactItem}>
            <Link src={resumeData.socialLink}></Link>
            {resumeData.socialLink}
          </Text>
        </View>
        <View>
          {sectionsToRender.map((section, index) => {
            return <View key={index}>{renderSection(section)}</View>;
          })}
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
    fontSize: '15',
    fontFamily: 'Proxima Nova',
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
    color: '#4c0519',
    marginRight: '8px',
    textDecoration: 'underline',
  },
  icon: {
    color: 'black',
    alignSelf: 'flex-end',
    marginRight: 3,
    width: 13,
    height: 13,
  },
  title: {
    marginTop: 12,
    fontSize: 15,
  },
  hrContainer: {
    width: '100%',
  },
  hr: {
    borderBottomWidth: '0.5',
    borderBottomColor: '#000000',
  },
  section: {
    width: '100%',
    alignSelf: 'flex-start',
    fontSize: 12,
    marginTop: 2,
  },
  sectionSplit: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftTitle: {
    fontWeight: 'semibold',
  },
  rightTitle: {
    color: '#4c0519',
  },
  rightTitleBold: {
    fontWeight: 'semibold',
    color: '#4c0519',
  },
  link: {
    color: '#000000',
  },
  linkIcon: {
    color: '#4c0519',
    width: 9,
    height: 9,
    marginLeft: 3,
  },
  flexStart: {
    alignSelf: 'flex-start',
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
