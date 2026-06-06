import React from 'react'
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
import interRegular from '@fontsource/inter/files/inter-latin-400-normal.woff'
import interMedium from '@fontsource/inter/files/inter-latin-500-normal.woff'

let fontsRegistered = false
function ensureFonts() {
  if (fontsRegistered) return
  Font.register({
    family: 'Inter',
    fonts: [
      { src: interRegular },
      { src: interMedium, fontWeight: 500 },
    ],
  })
  fontsRegistered = true
}

export async function preloadFonts() {
  ensureFonts()
  await Promise.all([
    Font.load({ fontFamily: 'Inter', fontStyle: 'normal', fontWeight: 400 }),
    Font.load({ fontFamily: 'Inter', fontStyle: 'normal', fontWeight: 500 }),
  ])
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
      fontWeight: 500,
      color: colorScheme.heading,
    },
    contact: {
      marginTop: 4,
      fontSize: Math.max(8, font.sizeBody - 1),
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    contactItem: {
      color: colorScheme.primary,
      marginRight: '8px',
      textDecoration: 'underline',
    },
    icon: {
      alignSelf: 'flex-end',
      marginRight: 3,
      width: 12,
      height: 12,
    },
    title: {
      marginTop: 10,
      marginBottom: 2,
      fontSize: font.sizeSection,
      fontWeight: 500,
      color: colorScheme.heading,
      letterSpacing: 0.1,
    },
    hrContainer: {
      width: '100%',
      marginBottom: 3,
    },
    hr: {
      borderBottomWidth: '0.75',
      borderBottomColor: colorScheme.divider,
    },
    section: {
      width: '100%',
      alignSelf: 'flex-start',
      fontSize: font.sizeBody,
      marginTop: 6,
    },
    sectionSplit: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    leftTitle: {
      fontWeight: 500,
      fontSize: font.sizeBody + 0.5,
      color: colorScheme.heading,
      lineHeight: 1.4,
    },
    rightTitle: {
      fontSize: Math.max(8, font.sizeBody - 0.5),
      color: colorScheme.subtext,
      lineHeight: 1.4,
    },
    rightTitleBold: {
      fontWeight: 500,
      fontSize: Math.max(8, font.sizeBody - 0.5),
      color: colorScheme.subtext,
      lineHeight: 1.4,
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
      marginTop: 2,
      fontSize: Math.max(8, font.sizeBody - 1),
      color: colorScheme.text,
      lineHeight: 1.5,
    },
  })
}

function getSocialIcon(platform: string) {
  switch (platform) {
    case 'github':
      return githubIcon
    case 'x':
      return xIcon
    case 'linkedin':
      return linkedinIcon
    default:
      return linkIcon
  }
}

export default function ClassicRenderer({
  data,
  options,
  sectionsOrder,
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
          {(data.socialLinks ?? []).map(({ platform, url }) => (
            <React.Fragment key={platform}>
              {options.showIcons && (
                <Image src={getSocialIcon(platform)} style={styles.icon} />
              )}
              <Text style={styles.contactItem}>
                <Link src={url.startsWith('http') ? url : `https://${url}`} />
                {url}
              </Text>
            </React.Fragment>
          ))}
        </View>
        <View>
          {sectionsToRender.map((section) => (
            <View key={section}>{renderSection(section)}</View>
          ))}
        </View>
      </Page>
    </Document>
  )
}
