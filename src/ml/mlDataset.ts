export type TrainingEmail = {
  text: string;
  label: 0 | 1;
};

export const mlDataset = [
  { text: `Subject: hpl nom for may 15, 2001. See attached file hplno515.xls.`, label: 0 },
  { text: `Subject: intra / inter gisb. Keith, would you please forward an intra/inter GISB to Enron. Thanks, Lynn.`, label: 0 },
  { text: `Subject: enron / hpl actuals for december 18, 2000. Teco tap 87.500 / hpl gas daily.`, label: 0 },
  { text: `Subject: enron / hpl actuals for december 19, 2000. Teco tap 25.000 / Enron; 100.000 / HPL gas daily.`, label: 0 },
  { text: `Subject: hpl nom for dec. 16-18, 2000. Sorry, one more time. The attached file should be correct.`, label: 0 },

  { text: `Subject: enron / hpl actuals for december 14, 2000. Teco tap 78.125 / HPL gas daily.`, label: 0 },
  { text: `Subject: hpl nom for may 17, 2001. See attached file hplno517.xls.`, label: 0 },
  { text: `Subject: noms / actuals for may 14th. We agree. Nom MCF MMBTU 40,000 40,119 41,202.`, label: 0 },
  { text: `Subject: enron / hpl actuals for december 13, 2000. Teco tap 37.500 / HPL gas daily.`, label: 0 },
  { text: `Subject: enron / hpl nom for december 19, 2000. See attached file hplnl219.xls.`, label: 0 },

  { text: `Subject: hpl nom for dec. 15, 2000. See attached file hplnl215.xls.`, label: 0 },
  { text: `Subject: enron / hpl actuals for december 15-17, 2000. Daily volume details are listed for December 15, 16, and 17.`, label: 0 },
  { text: `Subject: hpl nom for may 16, 2001. See attached file hplno516.xls.`, label: 0 },
  { text: `Subject: hpl nom for may 18, 2001. See attached file hplno518.xls.`, label: 0 },
  { text: `Subject: enron / hpl nom for december 20, 2000. See attached file hplnl220.xls.`, label: 0 },

  { text: `Subject: txu fuels / sds nomination for june 2001. Attached is the June 2001 nomination. Please advise should you have any questions.`, label: 0 },
  { text: `Subject: hpl nom for may 24, 2001. See attached file hplno524.xls.`, label: 0 },
  { text: `Subject: hpl nom for may 19-21, 2001. See attached file hplno519.xls.`, label: 0 },
  { text: `Subject: unify down - unix team working on it. The Unix server went down this morning. The Unix team is working on it.`, label: 0 },
  { text: `Subject: unify gas month end close - november 2001. Please review the attached month-end close document and let us know if changes are needed.`, label: 0 },

  { text: `Subject: noms / actual vols for 15th and 16th. We agree. The nomination and actual volume details are listed below.`, label: 0 },
  { text: `Subject: escalation procedures - gas logistics. I will be issuing a laminated list of contacts for escalation of Unify and EDI issues.`, label: 0 },
  { text: `Subject: hpl nom for may 23, 2001. See attached file hplno523.xls.`, label: 0 },
  { text: `Subject: noms / actual vols for 5/18 thru 5/20. We agree. Daily nomination and actual volume details are included.`, label: 0 },
  { text: `Subject: nom / actual vols for may 17th. We agree. Nom MCF MMBTU 26,250 28,151 28,911.`, label: 0 },

  { text: `Subject: unify production back - eol deals highlighted. The proton machine is up and Unify production is now available.`, label: 0 },
  { text: `Subject: hpl nom for may 22, 2001. See attached file hplno522.xls.`, label: 0 },
  { text: `Subject: nominations. Could you please check your records and see what volume was requested for May 12th?`, label: 0 },
  { text: `Subject: no / actual vols for 5/22/01. We agree. Nom MCF MMBTU 27,500 26,406 27,119.`, label: 0 },
  { text: `Subject: real time deal updates to path manager - test group. We are actively testing changes to Path Manager for real-time deal updates.`, label: 0 },

  { text: `Subject: buyer vs seller on intercompany deals. This memo clarifies how the volume feedback reconciliation report will reflect errors.`, label: 0 },
  { text: `Subject: procedure for adding new capacity tickets. This procedure explains how to set up capacity tickets for multi-desk service utilization.`, label: 0 },
  { text: `Subject: rollout schedule for unify real-time deal updates. A walk-through demo was held today with logistics managers and schedulers.`, label: 0 },
  { text: `Subject: monthly clean-up and bridge back for non-edi pipes. Please keep up with business on non-EDI pipes throughout the month.`, label: 0 },
  { text: `Subject: missing txu lonestar and oasis paths. We fixed the affected paths and corrected the code so this will not happen again.`, label: 0 },

  { text: `Subject: zero path termination in path manager. Please respond via email with any comments on the proposed path termination changes.`, label: 0 },
  { text: `Subject: pops it team temporarily moving to allen center. The POPS team will temporarily move to 3 Allen Center starting Monday.`, label: 0 },
  { text: `Subject: new su bridge. The new Sitara to Unify bridge monitor is now in production.`, label: 0 },
  { text: `Subject: unify close schedule. Please keep in mind the key close schedule times for this coming month.`, label: 0 },
  { text: `Subject: unify performance problem on wednesday. The system experienced performance problems and we are taking precautions to prevent recurrence.`, label: 0 },

  { text: `Subject: Project Update – Q2 Timeline. Hi Team, we are on track with development milestones and testing is scheduled to begin next week.`, label: 0 },
  { text: `Subject: Meeting Reminder – Marketing Sync. Hello everyone, just a reminder about our weekly marketing sync tomorrow at 10 AM.`, label: 0 },
  { text: `Subject: Your Order Has Been Confirmed. Thank you for your purchase. Your order has been successfully placed and is being processed.`, label: 0 },
  { text: `Subject: Invitation to College Seminar. You are invited to attend a seminar on Emerging Technologies in AI this Friday.`, label: 0 },
  { text: `Subject: Newsletter – April Edition. Welcome to our April newsletter featuring productivity tips, product launches, and upcoming events.`, label: 0 },

  { text: `Subject: Hotel Booking Confirmation. Your reservation has been successfully confirmed for your stay from May 5 to May 8.`, label: 0 },
  { text: `Subject: Course Registration Update. Your course registration for the upcoming semester has been successfully processed.`, label: 0 },
  { text: `Subject: Webinar Registration Confirmation. You are successfully registered for our upcoming webinar on digital marketing strategies.`, label: 0 },
  { text: `Subject: Office Closure Notice. The office will remain closed on Monday due to a public holiday and operations resume Tuesday.`, label: 0 },
  { text: `Subject: Appointment Confirmation. Your appointment has been scheduled for Thursday at 4 PM. We look forward to seeing you then.`, label: 0 },

  { text: "Your bank account has been suspended due to unusual activity. Verify immediately to restore access or your account will be closed.", label: 1 },
  { text: "Your transaction failed. Share the OTP sent to your phone to complete verification or your account will be restricted.", label: 1 },
  { text: "Congratulations! You won a lottery prize. Send your bank details and ID proof to claim within 48 hours.", label: 1 },
  { text: "Delivery failed. Confirm your address and pay re-delivery fee to receive your package.", label: 1 },
  { text: "Your email account will be deactivated. Verify your login credentials now to avoid deletion.", label: 1 },

  { text: "Payment declined. Update your card details immediately to avoid service interruption.", label: 1 },
  { text: "Suspicious login detected. Reset your password now to secure your account.", label: 1 },
  { text: "You are eligible for a tax refund. Submit your bank details to receive funds.", label: 1 },
  { text: "Account locked due to failed logins. Confirm credentials to unlock immediately.", label: 1 },
  { text: "Subscription renewal failed. Update payment details to continue services.", label: 1 },

  { text: "Salary update notice. Download attachment and login to view details.", label: 1 },
  { text: "Verify your account immediately due to suspicious activity or access will be revoked.", label: 1 },
  { text: "You are eligible for cashback reward. Claim now by verifying payment details.", label: 1 },
  { text: "KYC update required. Submit documents or your bank account will be suspended.", label: 1 },
  { text: "Invoice overdue. Pay immediately to avoid penalties and service disruption.", label: 1 },

  { text: "Mailbox storage full. Upgrade or verify account to continue receiving emails.", label: 1 },
  { text: "You have been selected for a job. Submit personal and bank details to proceed.", label: 1 },
  { text: "Unauthorized transaction detected. Confirm details to secure your account.", label: 1 },
  { text: "Social media account will be removed. Verify login details immediately.", label: 1 },
  { text: "You won a reward. Provide bank details to claim your prize.", label: 1 },

  { text: "Courier payment required. Pay customs fee to release your package.", label: 1 },
  { text: "Account upgrade required. Submit your details to avoid restrictions.", label: 1 },
  { text: "Password expiring today. Reset now to maintain access.", label: 1 },
  { text: "Insurance claim approved. Provide bank details to receive payment.", label: 1 },
  { text: "Final warning: verify your account or it will be deactivated permanently.", label: 1 },

  { text: "Account access limited. Confirm login credentials within 12 hours.", label: 1 },
  { text: "ATM card blocked. Update card details to reactivate services.", label: 1 },
  { text: "Cashback pending. Confirm bank details to receive reward today.", label: 1 },
  { text: "Multiple failed logins detected. Reset your password immediately.", label: 1 },
  { text: "Shipment on hold. Update address and pay processing fee.", label: 1 },

  { text: "Government subsidy approved. Submit bank details to receive funds.", label: 1 },
  { text: "Email verification required. Confirm identity or account will be closed.", label: 1 },
  { text: "Electricity bill unpaid. Pay now to avoid disconnection.", label: 1 },
  { text: "Refund failed. Update banking information to process again.", label: 1 },
  { text: "Security upgrade required. Verify account immediately.", label: 1 },

  { text: "Bonus released. Confirm salary account details to receive payment.", label: 1 },
  { text: "SIM card will be deactivated. Submit ID and phone details now.", label: 1 },
  { text: "Social account locked. Verify credentials to unlock.", label: 1 },
  { text: "You won a shopping voucher. Provide account details to claim.", label: 1 },
  { text: "Payroll update required. Submit bank details to avoid salary delay.", label: 1 },

  { text: "Internet service will be suspended. Update payment info now.", label: 1 },
  { text: "Package requires customs payment. Pay fee to proceed delivery.", label: 1 },
  { text: "Password expired. Reset immediately using the link.", label: 1 },
  { text: "Banking alert. Submit updated details to avoid restrictions.", label: 1 },
  { text: "Membership expiring today. Renew by confirming payment details.", label: 1 },

  { text: "Tax filing error found. Provide details to fix immediately.", label: 1 },
  { text: "Bank transfer failed. Verify account details to retry.", label: 1 },
  { text: "Security code sent. Reply with OTP to confirm identity.", label: 1 },
  { text: "Account at risk of suspension. Verify details now.", label: 1 },
  { text: "Final reminder: payment due. Pay now to avoid charges.", label: 1 }

];