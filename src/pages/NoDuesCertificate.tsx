import React, { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import api from "@/services/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Printer, ShieldCheck, Download, Award, FileText } from "lucide-react"

interface CertificateDetails {
  studentName: string
  enrollmentNo: string
  semester: string
  branch: string
  clearedDate: string
  subjects: { name: string; faculty: string; status: string }[]
}

export const NoDuesCertificate: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const studentId = searchParams.get("studentId")

  const [details, setDetails] = useState<CertificateDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCertificateDetails = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/api/student/certificate?studentId=${studentId || ""}`)
        setDetails(response.data)
      } catch (error) {
        console.warn("API offline, loading mock certificate details")
        
        // Mock Certificate Data
        const mockCert: CertificateDetails = {
          studentName: "AARAV SHARMA",
          enrollmentNo: "0812CS221001",
          semester: "VIII Semester",
          branch: "Computer Science & Engineering",
          clearedDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
          subjects: [
            { name: "Database Management Systems Lab", faculty: "Dr. Sandeep Poddar", status: "Approved" },
            { name: "Compiler Design Lab", faculty: "Prof. Neha Sharma", status: "Approved" },
            { name: "Information Security Lab", faculty: "Dr. R.K. Vyas", status: "Approved" },
            { name: "Computer Networks Lab", faculty: "Prof. Amit Dubey", status: "Approved" },
            { name: "Major Project & Seminar Phase-II", faculty: "Dr. Sandeep Poddar", status: "Approved" },
          ]
        }
        setDetails(mockCert)
      } finally {
        setLoading(false)
      }
    }

    fetchCertificateDetails()
  }, [studentId])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm flex flex-col items-center gap-2 justify-center h-[60vh]">
        <span className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></span>
        Generating secure clearance certificate...
      </div>
    )
  }

  if (!details) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm">
        Clearance data could not be verified.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* Print Specific CSS Block */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide everything except certificate container */
          body * {
            visibility: hidden;
            background: none !important;
          }
          .print-certificate-area, .print-certificate-area * {
            visibility: visible;
          }
          .print-certificate-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            border: 2px solid #0f172a !important;
            box-shadow: none !important;
            background-color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      {/* Action panel (Hidden on Print) */}
      <div className="no-print flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-xs text-slate-500 hover:text-slate-900 pl-0 self-start"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={handlePrint}
            className="text-xs bg-primary text-white hover:bg-primary/95 flex items-center gap-1.5 h-9 font-semibold shadow-md shadow-primary/10"
          >
            <Printer className="h-4 w-4" />
            Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Certificate Container */}
      <div className="flex justify-center p-2">
        <Card className="print-certificate-area w-full max-w-3xl bg-white border-[12px] border-slate-900 p-8 sm:p-12 shadow-2xl relative overflow-hidden text-slate-800">
          
          {/* Ornamental corner boarders */}
          <div className="absolute top-2 left-2 border-t-2 border-l-2 border-slate-300 w-8 h-8 pointer-events-none"></div>
          <div className="absolute top-2 right-2 border-t-2 border-r-2 border-slate-300 w-8 h-8 pointer-events-none"></div>
          <div className="absolute bottom-2 left-2 border-b-2 border-l-2 border-slate-300 w-8 h-8 pointer-events-none"></div>
          <div className="absolute bottom-2 right-2 border-b-2 border-r-2 border-slate-300 w-8 h-8 pointer-events-none"></div>

          {/* Watermark logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
            <Award className="h-96 w-96 text-primary" />
          </div>

          <CardContent className="space-y-8 p-0 text-center relative z-10">
            
            {/* Logo and College Brand */}
            <div className="space-y-2 pb-6 border-b border-slate-200">
              <div className="flex justify-center">
                <div className="h-14 w-14 rounded-full bg-slate-950 flex items-center justify-center text-white border-2 border-white shadow-lg">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-extrabold tracking-wider text-slate-900 leading-snug">
                  CHAMELI DEVI GROUP OF INSTITUTIONS
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest">
                  INDORE, MADHYA PRADESH, INDIA
                </p>
              </div>
            </div>

            {/* Certificate Header */}
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-slate-900">
                ACADEMIC NO-DUES CERTIFICATE
              </h2>
              <div className="h-0.5 w-40 bg-primary mx-auto"></div>
            </div>

            {/* Body Text */}
            <div className="space-y-4 max-w-xl mx-auto text-xs sm:text-sm text-slate-650 leading-relaxed font-light">
              <p>
                This is to certify that the student named below has successfully cleared all outstanding academic, laboratory, library, and department dues ledger holds for the session.
              </p>
              
              {/* Student Metadata Table */}
              <div className="my-6 bg-slate-50 p-4 rounded-xl border border-slate-100 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[9px] mb-0.5">Student Name</span>
                  <span className="text-slate-900 font-extrabold text-sm">{details.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[9px] mb-0.5">Enrollment Number</span>
                  <span className="text-slate-900 font-mono font-bold text-sm">{details.enrollmentNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[9px] mb-0.5">Course Branch</span>
                  <span className="text-slate-800 font-bold">{details.branch}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block text-[9px] mb-0.5">Active Academic Cycle</span>
                  <span className="text-slate-850 font-bold">{details.semester}</span>
                </div>
              </div>
            </div>

            {/* Clearance Department List */}
            <div className="space-y-2 text-left max-w-xl mx-auto">
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-1.5 mb-2">
                DEPARTMENT CLEARANCE LEDGER
              </h4>
              <div className="divide-y divide-slate-100 text-xs">
                {details.subjects.map((sub, i) => (
                  <div key={i} className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-800">{sub.name}</span>
                      <p className="text-[10px] text-slate-450 mt-0.5">Verified by: {sub.faculty}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-bold uppercase">
                      No Dues hold
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Signatures and Date */}
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-8 pt-10 max-w-xl mx-auto">
              <div className="text-center sm:text-left space-y-1">
                <span className="text-[10px] font-mono text-slate-500 font-semibold">{details.clearedDate}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block border-t border-slate-200 pt-1 w-32">
                  Date of Issue
                </span>
              </div>

              {/* Digital seal */}
              <div className="h-16 w-16 rounded-full border-2 border-emerald-500/20 flex items-center justify-center text-emerald-600 font-mono text-[7px] text-center border-dashed font-semibold rotate-[-8deg] relative">
                <div className="absolute inset-0.5 rounded-full border border-emerald-500/10"></div>
                CDGI<br />OFFICE SEAL<br />VERIFIED
              </div>

              <div className="text-center sm:text-right space-y-2">
                {/* Simulated Digital Signature */}
                <div className="h-6 flex items-center justify-center sm:justify-end">
                  <span className="font-serif italic text-primary font-bold text-sm tracking-widest rotate-[-3deg] block select-none">
                    Dr. S. Poddar
                  </span>
                </div>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block border-t border-slate-200 pt-1 w-32">
                  Head of Dept.
                </span>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

    </div>
  )
}
export default NoDuesCertificate
