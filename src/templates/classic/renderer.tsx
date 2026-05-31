import {
  Page,
  Image,
  Text,
  Link,
  View,
  Document,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import type { TemplateRenderProps, TemplateOptions } from '../types'
import emailIcon from '../../assets/icons/cv-icons/email.png'
import phoneIcon from '../../assets/icons/cv-icons/phone.png'
import linkedinIcon from '../../assets/icons/cv-icons/linkedin.png'
import githubIcon from '../../assets/icons/cv-icons/github.png'
import xIcon from '../../assets/icons/cv-icons/x.png'
import linkIcon from '../../assets/icons/cv-icons/link.png'
import { richTextToPdf } from '../../utils/richTextToPdf'

let fontsRegistered = false
function ensureFonts() {
  if (fontsRegistered) return
  Font.register({
    family: 'Open Sauce One',
    fonts: [
      { src: 'https://fonts.cdnfonts.com/s/88496/OpenSauceOne-Regular.woff' },
      {
        src: 'https://fonts.cdnfonts.com/s/88496/OpenSauceOne-SemiBold.woff',
        fontWeight: 'semibold',
      },
    ],
  })
  fontsRegistered = true
}

function createStyles(options: TemplateOptions) {
  const { colorScheme, font, pagePadding } = options
  const pad = pagePadding ?? { top: 30, bottom: 30, horizontal: 30 }

  return StyleSheet.create({
    page: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: colorScheme.background,
      paddingTop: pad.top,
      paddingBottom: pad.bottom,
      paddingHorizontal: pad.horizontal,
      fontSize: font.sizeBody,
      fontFamily: font.family,
      color: colorScheme.text,
    },
    fullName: {
      fontSize: font.sizeName,
      color: colorScheme.heading,
    },
    contact: {
      fontSize: font.sizeBody,
      display: 'flex',
      flexDirection: 'row',
    },
    contactItem: {
      color: colorScheme.primary,
      marginRight: '8px',
      textDecoration: 'underline',
    },
    icon: {
      alignSelf: 'flex-end',
      marginRight: 3,
      width: 13,
      height: 13,
    },
    title: {
      marginTop: 12,
      fontSize: font.sizeSection,
      color: colorScheme.heading,
    },
    hrContainer: {
      width: '100%',
    },
    hr: {
      borderBottomWidth: '0.5',
      borderBottomColor: colorScheme.divider,
    },
    section: {
      width: '100%',
      alignSelf: 'flex-start',
      fontSize: font.sizeBody,
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
      color: colorScheme.heading,
    },
    rightTitle: {
      color: colorScheme.subtext,
    },
    rightTitleBold: {
      fontWeight: 'semibold',
      color: colorScheme.subtext,
    },
    link: {
      color: colorScheme.heading,
    },
    linkIcon: {
      color: colorScheme.primary,
      width: 9,
      height: 9,
      marginLeft: 3,
    },
    flex: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    body: {
      color: colorScheme.text,
    },
  })
}

function getSocialIcon(platform: string) {
  switch (platform) {
    case 'github':
      return githubIcon
    case 'x':
      return xIcon
    default:
      return linkedinIcon
  }
}

export default function ClassicRenderer({
  data,
  options,
  sectionsOrder,
  selectedSocial,
}: TemplateRenderProps) {
  ensureFonts()
  const styles = createStyles(options)

  const sectionsToRender = sectionsOrder.filter(
    (section) => data.includeSections[section],
  )

  function renderSectionHeader(title: string) {
    return (
      <View style={styles.hrContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.hr} />
      </View>
    )
  }

  function renderSection(sectionName: string) {
    switch (sectionName) {
      case 'education':
        return (
          <View>
            <View>{renderSectionHeader('Education')}</View>
            {data.educationList.map((education, index) => (
              <View key={index}>
                <View style={styles.section}>
                  <View style={styles.sectionSplit}>
                    <Text style={styles.leftTitle}>{education.institutionName}</Text>
                    <Text style={styles.rightTitle}>{education.date}</Text>
                  </View>
                  <View style={styles.sectionSplit}>
                    <Text style={styles.rightTitle}>{education.courseTitle}</Text>
                    <Text style={styles.rightTitleBold}>{education.grade}</Text>
                  </View>
                  {richTextToPdf(education.description, { bodyStyle: styles.body })}
                </View>
              </View>
            ))}
          </View>
        )

      case 'professionalExperience':
        return (
          <View>
            <View>{renderSectionHeader('Professional Experience')}</View>
            {data.experienceList.map((experience, index) => (
              <View key={index}>
                <View style={styles.section}>
                  <View style={styles.sectionSplit}>
                    <Text style={styles.leftTitle}>{experience.companyName}</Text>
                    <Text style={styles.rightTitle}>
                      {experience.date} •{' '}
                      <Text style={styles.rightTitleBold}>{experience.location}</Text>
                    </Text>
                  </View>
                  <View style={styles.sectionSplit}>
                    <Text style={styles.rightTitle}>{experience.jobTitle}</Text>
                    <Text style={styles.rightTitle}>{experience.skills.join(', ')}</Text>
                  </View>
                  {richTextToPdf(experience.description, { bodyStyle: styles.body })}
                </View>
              </View>
            ))}
          </View>
        )

      case 'projects':
        return (
          <View>
            <View>{renderSectionHeader('Projects')}</View>
            {data.projectsList.map((project, index) => (
              <View key={index}>
                <View style={styles.section}>
                  <View style={styles.sectionSplit}>
                    <View style={styles.flex}>
                      <Text style={styles.leftTitle}>
                        {project.link ? (
                          <Link style={styles.link} src={project.link}>
                            {project.projectName}
                          </Link>
                        ) : (
                          project.projectName
                        )}
                      </Text>
                      {project.link ? (
                        <Image src={linkIcon} style={styles.linkIcon} />
                      ) : null}
                    </View>
                    <Text style={styles.rightTitle}>{project.date}</Text>
                  </View>
                  <View style={styles.sectionSplit}>
                    <Text style={styles.rightTitle}>{project.subHeading}</Text>
                  </View>
                  {richTextToPdf(project.description, { bodyStyle: styles.body })}
                </View>
              </View>
            ))}
          </View>
        )

      default: {
        const sectionData = data.customSectionData.find(
          (s) => s.title === sectionName,
        )
        if (!sectionData) return null
        return (
          <View>
            <View>{renderSectionHeader(sectionName)}</View>
            {sectionData.items.map((item, index) => (
              <View key={index}>
                <View style={styles.section}>
                  <View style={styles.sectionSplit}>
                    <Text style={styles.leftTitle}>{item.heading}</Text>
                    <Text style={styles.rightTitle}>{item.date}</Text>
                  </View>
                  <View style={styles.sectionSplit}>
                    <Text style={styles.rightTitle}>{item.subHeading}</Text>
                    <Text style={styles.rightTitleBold}>{item.additionalInfo}</Text>
                  </View>
                  {richTextToPdf(item.description, { bodyStyle: styles.body })}
                </View>
              </View>
            ))}
          </View>
        )
      }
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.fullName}>{data.fullName}</Text>
        </View>
        <View style={styles.contact}>
          {options.showIcons && (
            <Image src={emailIcon} style={styles.icon} />
          )}
          <Text style={styles.contactItem}>{data.email}</Text>
          {options.showIcons && (
            <Image src={phoneIcon} style={styles.icon} />
          )}
          <Text style={styles.contactItem}>{data.mobileNo}</Text>
          {options.showIcons && (
            <Image src={getSocialIcon(selectedSocial)} style={styles.icon} />
          )}
          <Text style={styles.contactItem}>
            <Link src={data.socialLink}></Link>
            {data.socialLink}
          </Text>
        </View>
        <View>
          {sectionsToRender.map((section, index) => (
            <View key={index}>{renderSection(section)}</View>
          ))}
        </View>
      </Page>
    </Document>
  )
}
