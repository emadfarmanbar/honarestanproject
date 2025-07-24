const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// اسکیمای اطلاعات والدین
const ParentInfoSchema = new Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  national_code: { type: String, required: true },
  birth_certificate: { type: String, required: true },
  birth_date: { type: String, required: true },
  education: { type: String, required: true },
  job: { type: String, required: true },
  work_address: { type: String, required: true },
  work_phone: { type: String, required: true }
}, { _id: false });

// اسکیمای مرحله ۶
const Step6Schema = new Schema({
  family: {
    livingWith: { type: String, required: true },
    livingWithOthers: { type: String },
    parentsStatus: { type: String, required: true },
    divorcedParents: { type: Boolean, required: true },
    deceasedParents: { type: Boolean, required: true },
    deceasedExplanation: { type: String }
  },
  skills: {
    workingOutside: { type: Boolean, required: true },
    workingExplanation: { type: String },
    sportsRank: { type: Boolean, required: true },
    sportsRankDesc: { type: String },
    artRank: { type: Boolean, required: true },
    artRankDesc: { type: String },
    specialSkill: { type: Boolean, required: true },
    specialSkillDesc: { type: String }
  },
  identity: {
    isSadat: { type: Boolean, required: true },
    writingHand: { type: String, required: true },
    parentTeacher: { type: Boolean, required: true },
    fatherStaffCode: { type: String },
    motherStaffCode: { type: String },
    religion: { type: String, required: true },
    religionOther: { type: String },
    nationality: { type: String, required: true },
    nationalityCountry: { type: String },
    insurance: { type: String, required: true },
    supportOrg: { type: String },
    isVeteranFamily: { type: Boolean, required: true },
    veteranPriority: { type: String },
    veteranPriorityOthers: { type: String },
    physicalStatus: { type: String, required: true },
    disabilities: [{ type: String }]
  },
  education: {
    ninthGradeAverage: { type: String, required: true },
    ninthGradeDiscipline: { type: String, required: true },
    additionalNotes: { type: String }
  }
}, { _id: false });

// اسکیمای مرحله ۷
const Step7Schema = new Schema({
  acceptRules: { type: Boolean, required: true }
}, { _id: false });

// اسکیمای مرحله ۸
const Step8Schema = new Schema({
  paymentMethod: { type: String, required: true },
  cashPayment: {
    amount: { type: Number },
    date: { type: String },
    trackingCode: { type: String }
  },
  checkPayment: {
    cash: {
      amount: { type: Number },
      date: { type: String },
      trackingCode: { type: String }
    },
    checks: [{
      amount: { type: Number },
      date: { type: String },
      trackingCode: { type: String },
      bank: { type: String },
      shaba: { type: String },
      accountHolder: { type: String }
    }]
  },
  cooperation: { type: String, required: true },
  cooperationFields: [{ type: String }],
  knowsBenefactor: { type: String, required: true },
  benefactorInfo: { type: String }
}, { _id: false });

// اسکیمای مدارک (مرحله ۹)
const DocumentsSchema = new Schema({
  studentPhoto: { type: String },
  studentBirthCertificate: { type: String },
  fatherBirthCertificate: { type: String },
  motherBirthCertificate: { type: String },
  fatherNationalCard: { type: String },
  motherNationalCard: { type: String },
  guidanceForm: { type: String },
  ninthGradeReport: { type: String },
  vaccinationCard: { type: String }
}, { _id: false });

// اسکیمای اصلی
const RegistrationSchema = new Schema({
  mobile: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fatherName: { type: String, required: true },
  nationalId: { type: String, required: true },
  shenasnamehSerial: { type: String, required: true },
  issuePlace: { type: String, required: true },
  birthPlace: { type: String, required: true },
  birthDate: { type: String, required: true },
  major: { type: String, required: true },
  fatherInfo: { type: ParentInfoSchema, required: true },
  motherInfo: { type: ParentInfoSchema, required: true },
  special_mobile: { type: String, required: true },
  home_phone: { type: String },
  father_mobile: { type: String },
  mother_mobile: { type: String },
  student_mobile: { type: String },
  guardian: { type: String, required: true },
  other_guardian_phone: { type: String },
  province: { type: String, required: true },
  county: { type: String, required: true },
  city: { type: String, required: true },
  main_street: { type: String, required: true },
  side_street: { type: String },
  main_alley: { type: String },
  side_alley: { type: String },
  building_number: { type: String },
  floor: { type: String },
  postal_code: { type: String },
  housing_status: { type: String, required: true },
  other_housing_desc: { type: String },
  step6: { type: Step6Schema, required: true },
  step7: { type: Step7Schema, required: false }, // اختیاری کردن step7
  step8: { type: Step8Schema, required: false }, // اختیاری کردن step8
  documents: { type: DocumentsSchema, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Registration', RegistrationSchema);