import { Language } from '../types/mess';

export interface TranslationStrings {
  brandTitle: string;
  langBtn: string;
  downloadPdf: string;
  exportExcel: string;
  print: string;
  resetData: string;
  tabMain: string;
  tabBazar: string;
  tabDailyMeal: string;
  tabSettings: string;
  signInSync: string;
  signOut: string;
  cloudSynced: string;
  localMode: string;
  kpiTotalDeposit: string;
  kpiCurrentMonth: string;
  kpiTotalBazar: string;
  kpiBazarSub: string;
  kpiRemained: string;
  kpiRemainedSub: string;
  kpiTotalMeals: string;
  kpiMealsSub: string;
  kpiMealRate: string;
  kpiRateSub: string;
  kpiNetBalance: string;
  kpiNetSub: string;
  searchPlaceholder: string;
  addMember: string;
  quickFeastLabel: string;
  editHint: string;
  colName: string;
  colNameSub: string;
  colPrev: string;
  colPrevSub: string;
  colDeposit: string;
  colDepositSub: string;
  colTotal: string;
  colTotalSub: string;
  colMealQty: string;
  colMealQtySub: string;
  colMealRate: string;
  colMealRateSub: string;
  colCostMeal: string;
  colCostMealSub: string;
  colChefCost: string;
  colChefCostSub: string;
  colFeastCost: string;
  colFeastCostSub: string;
  colTotalCost: string;
  colTotalCostSub: string;
  colNetBalance: string;
  colNetBalanceSub: string;
  sideBazarTitle: string;
  viewAll: string;
  colDate: string;
  colCost: string;
  totalBazarLabel: string;
  summaryBoxTitle: string;
  sumRemained: string;
  sumTotalDeposit: string;
  sumPrevBalance: string;
  sumNetBalance: string;
  sumTotalBazar: string;
  formulaTitle: string;
  formula1: string;
  formula2: string;
  formula3: string;
  formula4: string;
  bazarHeader: string;
  bazarSub: string;
  colShopper: string;
  colBazarAmount: string;
  shopperPlaceholder: string;
  dailyMealHeader: string;
  dailyMealSub: string;
  fillSampleMeals: string;
  syncMealsBtn: string;
  settingsTitle: string;
  setMonthLabel: string;
  setMonthEnLabel: string;
  chefRuleLabel: string;
  chefRuleDesc: string;
  chefRuleEqual: string;
  chefRuleProp: string;
  feastRuleLabel: string;
  feastRuleDesc: string;
  applyFeastBtn: string;
  backupTitle: string;
  backupDesc: string;
  backupDownloadBtn: string;
  backupRestoreBtn: string;
  modalAddTitle: string;
  isChefLabel: string;
  cancel: string;
  save: string;
  resetModalTitle: string;
  resetModalDesc: string;
  confirmReset: string;
  totalRowLabel: string;
  chefTag: string;
  statusReceivable: string;
  statusDue: string;
  statusSettled: string;
  emptyMembersTitle: string;
  emptyMembersDesc: string;
  newMonthBtn: string;
  newMonthModalTitle: string;
  newMonthModalDesc: string;
  createNewMonth: string;
  monthSelectorLabel: string;
  deleteConfirm: string;
  toastSaved: string;
  toastMealsSynced: string;
  toastFeastApplied: string;
  toastResetDone: string;
  toastPdfDone: string;
  toastExcelDone: string;
  toastBackupDone: string;
  toastRestoreDone: string;
  toastRestoreError: string;
  toastSampleFilled: string;
  toastNewMonthCreated: string;
}

export const I18N: Record<Language, TranslationStrings> = {
  bn: {
    brandTitle: 'মেস মিল ও বাজার হিসাব',
    langBtn: 'English',
    downloadPdf: 'পিডিএফ ডাউনলোড',
    exportExcel: 'এক্সেল (.xlsx)',
    print: 'প্রিন্ট',
    resetData: 'রিসেট',
    tabMain: 'মেইন হিসাব শিট',
    tabBazar: 'দৈনিক বাজার (৩০ দিন)',
    tabDailyMeal: 'দৈনিক মিল চার্ট',
    tabSettings: 'হিসাবের নিয়ম ও ফিস্ট',
    signInSync: 'গুগল সিঙ্ক চালু করুন',
    signOut: 'সাইন আউট',
    cloudSynced: 'ক্লাউড সিঙ্ক সক্রিয়',
    localMode: 'লোকাল মোড (সিঙ্ক করতে লগইন করুন)',
    kpiTotalDeposit: 'মোট জমা (Deposit)',
    kpiCurrentMonth: 'চলতি মাসের জমা',
    kpiTotalBazar: 'মোট বাজার (Bazar)',
    kpiBazarSub: '১ - ৩০ তারিখ মোট খরচ',
    kpiRemained: 'ক্যাশ অবশিষ্ট (Remained)',
    kpiRemainedSub: 'মোট জমা − মোট বাজার',
    kpiTotalMeals: 'মোট মিল (Total Meals)',
    kpiMealsSub: 'সদস্য + শেফ মিল',
    kpiMealRate: 'মিল রেট (Meal Rate)',
    kpiRateSub: 'মোট বাজার ÷ মোট মিল',
    kpiNetBalance: 'সর্বমোট নিট ব্যালেন্স',
    kpiNetSub: 'সদস্যদের পাওনা/দেনা যোগফল',
    searchPlaceholder: 'সদস্য খুঁজুন...',
    addMember: 'নতুন সদস্য',
    quickFeastLabel: 'মোট ফিস্ট খরচ (সবার জন্য সমান):',
    editHint: 'যেকোনো ঘরের সংখ্যায় ক্লিক করে সরাসরি পরিবর্তন করতে পারবেন',
    colName: 'নাম',
    colNameSub: 'Member Name',
    colPrev: 'পূর্বের ব্যালেন্স',
    colPrevSub: 'Previous Balance',
    colDeposit: 'জমা',
    colDepositSub: 'Deposit',
    colTotal: 'মোট জমা',
    colTotalSub: 'Total',
    colMealQty: 'মিল সংখ্যা',
    colMealQtySub: 'Meal QTY',
    colMealRate: 'মিল রেট',
    colMealRateSub: 'Meal Rate',
    colCostMeal: 'মিল খরচ',
    colCostMealSub: 'Cost/Meal',
    colChefCost: 'শেফ মিল',
    colChefCostSub: 'Chef Cost',
    colFeastCost: 'ফিস্ট খরচ',
    colFeastCostSub: 'Feast Cost',
    colTotalCost: 'মোট খরচ',
    colTotalCostSub: 'Total Cost',
    colNetBalance: 'নিট ব্যালেন্স',
    colNetBalanceSub: 'Net Balance',
    sideBazarTitle: 'দৈনিক বাজার (৩০ দিন)',
    viewAll: 'সব দেখুন',
    colDate: 'তারিখ (Date)',
    colCost: 'খরচ (Cost)',
    totalBazarLabel: 'মোট বাজার (Total bazar)',
    summaryBoxTitle: 'ক্যাশ ও ব্যালেন্স সারসংক্ষেপ',
    sumRemained: 'অবশিষ্ট ক্যাশ (Remained)',
    sumTotalDeposit: 'মোট জমা (Total Deposit)',
    sumPrevBalance: 'সর্বমোট পূর্বের ব্যালেন্স (Previous Balance)',
    sumNetBalance: 'মোট নিট ব্যালেন্স (Net Balance)',
    sumTotalBazar: 'মোট বাজার (Total bazar)',
    formulaTitle: 'নির্ভুল হিসাবের সূত্রসমূহ (Zero-Error Accounting Logic)',
    formula1: 'মোট জমা (Total): পূর্বের ব্যালেন্স (Previous Balance) + চলতি মাসের জমা (Deposit)',
    formula2: 'মিল রেট (Meal Rate): মোট বাজার খরচ ÷ সর্বমোট মিল (সদস্য + শেফ)',
    formula3: 'শেফ মিল খরচ (Chef Meal Cost): শেফের মিলের মোট খরচ সক্রিয় সদস্যদের মাঝে বণ্টিত হয়।',
    formula4: 'নিট ব্যালেন্স (Net Balance): মোট জমা − মোট খরচ (পাওনা মানে মেস থেকে পাবেন, দেনা মানে মেসে দিতে হবে)।',
    bazarHeader: 'দৈনিক বাজারের হিসাব',
    bazarSub: 'প্রতিদিনের বাজারের টাকা ও বাজারকারীর নাম লিখুন; মেইন শিটে স্বয়ংক্রিয়ভাবে আপডেট হবে।',
    colShopper: 'বাজারকারী ও বিবরণ (Shopper / Items)',
    colBazarAmount: 'বাজার খরচ (টাকা)',
    shopperPlaceholder: 'যেমন: মাছ, সবজি (বাজারকারী: রাসেদ)',
    dailyMealHeader: 'দৈনিক মিল এন্ট্রি চার্ট (১ - ৩০ দিন)',
    dailyMealSub: 'প্রতিদিনের মিল সংখ্যা (যেমন: 0, 1, 1.5, 2, 2.5, 3) বসান এবং "মেইন শিটে মিল আপডেট করুন" বাটনে ক্লিক করুন।',
    fillSampleMeals: 'নমুনা মিল বসান (টেস্ট)',
    syncMealsBtn: 'মেইন শিটে মিল আপডেট করুন',
    settingsTitle: 'হিসাবের সেটিংস ও ফিস্ট ব্যবস্থাপনা',
    setMonthLabel: 'মাসের নাম (বাংলায়)',
    setMonthEnLabel: 'মাসের নাম (ইংরেজিতে)',
    chefRuleLabel: 'শেফের মিল খরচ বণ্টন পদ্ধতি (Chef Meal Cost Rule)',
    chefRuleDesc: 'শেফের নিজের মিলের খরচ (Chef Meal QTY × Meal Rate) সাধারণ সদস্যদের মাঝে কীভাবে ভাগ হবে?',
    chefRuleEqual: 'সকল সক্রিয় সদস্যদের মাঝে সমান ভাগে (Equal Split)',
    chefRuleProp: 'সদস্যদের মিল সংখ্যার অনুপাতে (Proportional to Meal QTY)',
    feastRuleLabel: 'ফিস্ট বা বিশেষ ভোজের খরচ বণ্টন (Feast Cost)',
    feastRuleDesc: 'মোট ফিস্ট খরচ লিখলে তা সক্রিয় সদস্যদের (শেফ বাদে) মাঝে সমান ভাগে বণ্টিত হয়ে মেইন শিটের "ফিস্ট খরচ" কলামে বসে যাবে।',
    applyFeastBtn: 'সবার মাঝে ভাগ করুন',
    backupTitle: 'ডাটা ব্যাকআপ ও রিস্টোর (JSON File)',
    backupDesc: 'হিসাবের ব্যাকআপ ফাইল সেভ করে রাখুন অথবা অন্য ফোনে লোড করুন।',
    backupDownloadBtn: 'ব্যাকআপ ডাউনলোড করুন',
    backupRestoreBtn: 'ব্যাকআপ ফাইল লোড করুন',
    modalAddTitle: 'নতুন সদস্য যোগ করুন',
    isChefLabel: 'ইনি মেসের শেফ/বাবুর্চি (তাঁর মিল খরচ সদস্যদের মাঝে ভাগ হবে)',
    cancel: 'বাতিল',
    save: 'সংরক্ষণ করুন',
    resetModalTitle: 'ছবির মূল তথ্যে ফিরে যাবেন?',
    resetModalDesc: 'এতে আপনার বর্তমান পরিবর্তনগুলো মুছে গিয়ে নভেম্বর ২০২৬-এর হুবহু ২৮ জন সদস্য, ৯১,১১০.০০ টাকা জমা এবং ৬৮,১০০.০০ টাকা বাজারের হিসাব লোড হবে।',
    confirmReset: 'হ্যাঁ, রিসেট করুন',
    totalRowLabel: 'সর্বমোট (Total)',
    chefTag: 'শেফ',
    statusReceivable: 'পাওনা',
    statusDue: 'দেনা',
    statusSettled: 'সমান',
    emptyMembersTitle: 'কোনো সদস্য পাওয়া যায়নি',
    emptyMembersDesc: 'আপনার সার্চ ফিল্টার পরিবর্তন করুন অথবা নতুন সদস্য যোগ করুন।',
    newMonthBtn: 'নতুন মাস তৈরি',
    newMonthModalTitle: 'নতুন মাসের হিসাব শুরু করুন',
    newMonthModalDesc: 'বর্তমান মাসের নিট ব্যালেন্স স্বয়ংক্রিয়ভাবে নতুন মাসের "পূর্বের ব্যালেন্স" হিসেবে যুক্ত হবে এবং জমা, মিল ও বাজার ০ থেকে শুরু হবে।',
    createNewMonth: 'নতুন মাস চালু করুন',
    monthSelectorLabel: 'মাস নির্বাচন:',
    deleteConfirm: 'সদস্য মুছবেন?',
    toastSaved: 'সফলভাবে সংরক্ষিত হয়েছে!',
    toastMealsSynced: 'দৈনিক মিল মেইন শিটে আপডেট হয়েছে!',
    toastFeastApplied: 'ফিস্ট খরচ সবার মাঝে ভাগ করা হয়েছে!',
    toastResetDone: 'নভেম্বর ২০২৬-এর মূল হিসাব লোড হয়েছে!',
    toastPdfDone: 'PDF ফাইল সফলভাবে ডাউনলোড হয়েছে!',
    toastExcelDone: 'এক্সেল (.xlsx) ফাইল ডাউনলোড হয়েছে!',
    toastBackupDone: 'ব্যাকআপ ফাইল সেভ হয়েছে!',
    toastRestoreDone: 'ব্যাকআপ ডাটা সফলভাবে লোড হয়েছে!',
    toastRestoreError: 'সঠিক ব্যাকআপ ফাইল নয়!',
    toastSampleFilled: 'নমুনা মিল বসানো হয়েছে — এখন "মেইন শিটে মিল আপডেট করুন" ক্লিক করুন।',
    toastNewMonthCreated: 'নতুন মাস তৈরি ও ব্যালেন্স ক্যারি-ফরওয়ার্ড সম্পন্ন হয়েছে!',
  },
  en: {
    brandTitle: 'Mess Meal & Bazar',
    langBtn: 'বাংলা',
    downloadPdf: 'Download PDF',
    exportExcel: 'Excel (.xlsx)',
    print: 'Print',
    resetData: 'Reset',
    tabMain: 'Main Account Sheet',
    tabBazar: 'Daily Bazar (30 Days)',
    tabDailyMeal: 'Daily Meal Chart',
    tabSettings: 'Rules & Feast',
    signInSync: 'Sign in with Google',
    signOut: 'Sign Out',
    cloudSynced: 'Cloud Sync Active',
    localMode: 'Local Mode (Sign in to sync)',
    kpiTotalDeposit: 'Total Deposit',
    kpiCurrentMonth: 'Current month deposit',
    kpiTotalBazar: 'Total Bazar',
    kpiBazarSub: 'Days 1–30 total expense',
    kpiRemained: 'Remained Cash',
    kpiRemainedSub: 'Total Deposit − Total Bazar',
    kpiTotalMeals: 'Total Meals',
    kpiMealsSub: 'Members + Chef meals',
    kpiMealRate: 'Meal Rate',
    kpiRateSub: 'Total Bazar ÷ Total Meals',
    kpiNetBalance: 'Total Net Balance',
    kpiNetSub: 'Sum of member receivables & dues',
    searchPlaceholder: 'Search member...',
    addMember: 'Add Member',
    quickFeastLabel: 'Total Feast Cost (Equal Split):',
    editHint: 'Click any numeric cell to edit directly',
    colName: 'Name',
    colNameSub: 'Member Name',
    colPrev: 'Prev. Balance',
    colPrevSub: 'Previous Balance',
    colDeposit: 'Deposit',
    colDepositSub: 'Current Month',
    colTotal: 'Total',
    colTotalSub: 'Prev + Deposit',
    colMealQty: 'Meal QTY',
    colMealQtySub: 'Total Meals',
    colMealRate: 'Meal Rate',
    colMealRateSub: 'Per Meal',
    colCostMeal: 'Cost/Meal',
    colCostMealSub: 'Meal Expense',
    colChefCost: 'Chef Cost',
    colChefCostSub: 'Chef Share',
    colFeastCost: 'Feast Cost',
    colFeastCostSub: 'Special Event',
    colTotalCost: 'Total Cost',
    colTotalCostSub: 'All Expenses',
    colNetBalance: 'Net Balance',
    colNetBalanceSub: 'Total − Cost',
    sideBazarTitle: 'Daily Bazar (30 Days)',
    viewAll: 'View All',
    colDate: 'Date',
    colCost: 'Cost',
    totalBazarLabel: 'Total Bazar',
    summaryBoxTitle: 'Cash & Balance Summary',
    sumRemained: 'Remained Cash',
    sumTotalDeposit: 'Total Deposit',
    sumPrevBalance: 'Total Previous Balance',
    sumNetBalance: 'Total Net Balance',
    sumTotalBazar: 'Total Bazar',
    formulaTitle: 'Zero-Error Accounting Formulas',
    formula1: 'Total Fund: Previous Balance + Current Month Deposit.',
    formula2: 'Meal Rate: Total Bazar Expense ÷ Total Meals (Members + Chef).',
    formula3: 'Chef Meal Cost: Chef meal expense is distributed across active regular members.',
    formula4: 'Net Balance: Total Fund − Total Cost (Receivable means refund due; Due means payable to mess).',
    bazarHeader: 'Daily Bazar Expense Log',
    bazarSub: 'Enter daily bazar costs and shopper/item notes; the main sheet updates automatically.',
    colShopper: 'Shopper & Items Note',
    colBazarAmount: 'Bazar Cost (BDT)',
    shopperPlaceholder: 'e.g., Fish, vegetables (Shopper: Rasel)',
    dailyMealHeader: 'Daily Meal Attendance Chart (Days 1–30)',
    dailyMealSub: 'Enter daily meal counts (0, 1, 1.5, 2, 2.5, 3) and click "Sync Meals to Main Sheet".',
    fillSampleMeals: 'Fill Sample Meals',
    syncMealsBtn: 'Sync Meals to Main Sheet',
    settingsTitle: 'Accounting Rules & Feast Settings',
    setMonthLabel: 'Month Label (Bengali)',
    setMonthEnLabel: 'Month Label (English)',
    chefRuleLabel: 'Chef Meal Cost Distribution Rule',
    chefRuleDesc: 'How should the Chef’s own meal expense (Chef Meal QTY × Meal Rate) be shared among members?',
    chefRuleEqual: 'Equal Split across active members',
    chefRuleProp: 'Proportional to Member Meal QTY',
    feastRuleLabel: 'Feast / Special Meal Cost Distribution',
    feastRuleDesc: 'Enter total feast cost to divide equally among active non-chef members in the Feast Cost column.',
    applyFeastBtn: 'Distribute Equally',
    backupTitle: 'Data Backup & Restore (JSON File)',
    backupDesc: 'Save a full ledger backup file or restore from an exported JSON file.',
    backupDownloadBtn: 'Download Backup',
    backupRestoreBtn: 'Restore Backup File',
    modalAddTitle: 'Add New Member',
    isChefLabel: 'Mess Chef / Cook (meal cost shared among members)',
    cancel: 'Cancel',
    save: 'Save Member',
    resetModalTitle: 'Reset to Original Nov 2026 Data?',
    resetModalDesc: 'This restores the exact 28 members, 91,110.00 Total Deposit, and 68,100.00 Total Bazar from the Nov 2026 spreadsheet.',
    confirmReset: 'Yes, Reset',
    totalRowLabel: 'Total',
    chefTag: 'Chef',
    statusReceivable: 'Receivable',
    statusDue: 'Due',
    statusSettled: 'Settled',
    emptyMembersTitle: 'No matching members',
    emptyMembersDesc: 'Adjust your search query or add a new member to the ledger.',
    newMonthBtn: 'New Month',
    newMonthModalTitle: 'Start Next Month Ledger',
    newMonthModalDesc: 'Each member’s current Net Balance will carry forward as their Previous Balance, while Deposit, Meals, and Bazar start at 0.',
    createNewMonth: 'Create Month Ledger',
    monthSelectorLabel: 'Ledger Month:',
    deleteConfirm: 'Remove member?',
    toastSaved: 'Changes saved!',
    toastMealsSynced: 'Daily meals synced to Main Sheet!',
    toastFeastApplied: 'Feast cost distributed among active members!',
    toastResetDone: 'Restored original Nov 2026 spreadsheet data!',
    toastPdfDone: 'PDF report downloaded successfully!',
    toastExcelDone: 'Excel (.xlsx) workbook downloaded!',
    toastBackupDone: 'JSON backup saved!',
    toastRestoreDone: 'Backup restored successfully!',
    toastRestoreError: 'Invalid backup JSON file!',
    toastSampleFilled: 'Sample meals filled — click "Sync Meals to Main Sheet" to apply.',
    toastNewMonthCreated: 'New month created with balances carried forward!',
  },
};
