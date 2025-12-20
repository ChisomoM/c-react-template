import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { toast } from 'sonner';
import { FirebaseFirestore } from '../lib/firebase/firestore';
import { type JoinZuteFormData } from '../types/join-zute';
import { FileUpload } from './FileUpload';
import { useImageUpload } from '../hooks/useImageUpload';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function JoinZuteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sigCanvas = useRef<SignatureCanvas>(null);
  const { uploadFile } = useImageUpload();
  
  const form = useForm<JoinZuteFormData>({
    defaultValues: {
      school: '',
      poBox: '',
      applicationDate: new Date().toISOString().split('T')[0],
      fullName: '',
      tsManNo: '',
      employmentNo: '',
      salaryScale: '',
      district: '',
      province: '',
      previousUnion: '',
      payPoint: '',
      payPointDistrict: '',
      nrc: '',
      nrcFront: '',
      nrcBack: '',
      contactNumber: '',
      reasonForJoining: '',
      applicantSignature: '',
      status: 'pending',
    },
  });

  const clearSignature = () => {
    sigCanvas.current?.clear();
    form.setValue('applicantSignature', '');
  };

  const onSubmit = async (data: JoinZuteFormData) => {
    if (sigCanvas.current?.isEmpty()) {
      toast.error('Please sign the form before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Get signature as base64 image
      if (!sigCanvas.current) {
        throw new Error('Signature canvas not available');
      }

      // Use toDataURL directly from the canvas
      const canvas = sigCanvas.current.getCanvas();
      const signatureDataUrl = canvas.toDataURL('image/png');
      
      if (!signatureDataUrl) {
        throw new Error('Failed to capture signature');
      }

      // Upload signature to Cloudinary with timeout
      // Convert data URL to Blob
      const res = await fetch(signatureDataUrl);
      const blob = await res.blob();
      const file = new File([blob], `signature_${Date.now()}.png`, { type: 'image/png' });
      
      // Create timeout promise for Cloudinary upload (75 seconds)
      const uploadWithTimeout = Promise.race([
        uploadFile(file),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Upload timeout - please try again')), 75000)
        )
      ]);

      const uploadResult = await uploadWithTimeout;
      const signatureUrl = uploadResult.url;

      // Save form data to Firestore with timeout (30 seconds)
      const formData = {
        ...data,
        applicantSignature: signatureUrl,
        createdAt: new Date(),
      };

      const saveWithTimeout = Promise.race([
        FirebaseFirestore.addDocument('join_requests', formData),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Save timeout - please try again')), 30000)
        )
      ]);

      await saveWithTimeout;

      toast.success('Application submitted successfully!');
      form.reset();
      clearSignature();
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full" id="join-form">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* School Details Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-[#172E70] rounded-lg flex items-center justify-center text-white font-bold text-sm">1</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">School Information</h3>
                <p className="text-sm text-gray-500">Where do you currently teach?</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">School Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lusaka Primary School" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="poBox"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">P.O. Box</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., P.O. Box 12345" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
               <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">District</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lusaka" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Province</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lusaka Province" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="applicationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Application Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Personal Details Section */}
          <div className="space-y-5 pt-6 border-t-2 border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-[#172E70] rounded-lg flex items-center justify-center text-white font-bold text-sm">2</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                <p className="text-sm text-gray-500">Tell us about yourself</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Banda Mwanza" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nrc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">National Registration Card (NRC)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 123456/78/9" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., +260 97 1234567" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="referralCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Referral Code <span className="text-gray-400 font-normal">(Optional)</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter if referred by a member" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Employment Details Section */}
          <div className="space-y-5 pt-6 border-t-2 border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-[#172E70] rounded-lg flex items-center justify-center text-white font-bold text-sm">3</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Employment Details</h3>
                <p className="text-sm text-gray-500">Your teaching position information</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="tsManNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">TS/MAN Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., TS12345" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employmentNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Employment Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., EMP67890" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salaryScale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Salary Scale</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., D2, D3, etc." {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reasonForJoining"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Why are you joining ZUTE?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select your primary reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem value="better_representation">Better Representation</SelectItem>
                        <SelectItem value="legal_protection">Legal Protection</SelectItem>
                        <SelectItem value="professional_development">Professional Development</SelectItem>
                        <SelectItem value="financial_benefits">Financial Benefits</SelectItem>
                        <SelectItem value="empowerment">Empowerment</SelectItem>
                        <SelectItem value="solidarity">Solidarity with Colleagues</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* NRC Documents Section */}
          <div className="space-y-5 pt-6 border-t-2 border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-[#172E70] rounded-lg flex items-center justify-center text-white font-bold text-sm">4</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Identity Verification</h3>
                <p className="text-sm text-gray-500">Upload clear photos of your NRC (front and back)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="nrcFront"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">NRC Front Side</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <FileUpload
                          onUpload={(result) => field.onChange(result.url)}
                          acceptImages={true}
                          acceptPDFs={true}
                          label="Upload NRC Front"
                        />
                        {field.value && (
                          <div className="text-sm text-green-600 flex items-center gap-2 bg-green-50 p-2 rounded">
                            <span>✓ File uploaded successfully</span>
                            <a href={field.value} target="_blank" rel="noreferrer" className="underline text-blue-600 hover:text-blue-800">View</a>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nrcBack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">NRC Back Side</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <FileUpload
                          onUpload={(result) => field.onChange(result.url)}
                          acceptImages={true}
                          acceptPDFs={true}
                          label="Upload NRC Back"
                        />
                        {field.value && (
                          <div className="text-sm text-green-600 flex items-center gap-2 bg-green-50 p-2 rounded">
                            <span>✓ File uploaded successfully</span>
                            <a href={field.value} target="_blank" rel="noreferrer" className="underline text-blue-600 hover:text-blue-800">View</a>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Union & Payment Details Section */}
          <div className="space-y-5 pt-6 border-t-2 border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-[#172E70] rounded-lg flex items-center justify-center text-white font-bold text-sm">5</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Union & Payment Information</h3>
                <p className="text-sm text-gray-500">Details for salary deduction setup</p>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="previousUnion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Previous Union <span className="text-gray-400 font-normal">(If applicable)</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., ZATUC, BETUZ, etc." {...field} className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Authorization:</span> I hereby direct the end user to deduct my union contribution from my salary and remit it to the <span className="font-semibold">Zambia Union for Teacher Empowerment (ZUTE)</span>.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <FormField
                control={form.control}
                name="payPoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Pay Point</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lusaka DEBS" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="payPointDistrict"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Pay Point District</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lusaka" {...field} className="h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Signature Section */}
          <div className="space-y-5 pt-6 border-t-2 border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-[#172E70] rounded-lg flex items-center justify-center text-white font-bold text-sm">6</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Digital Signature</h3>
                <p className="text-sm text-gray-500">Sign to confirm your application</p>
              </div>
            </div>
            
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Please sign in the box below</Label>
              <div className="border-2 border-gray-400 bg-white rounded-lg overflow-hidden h-48 w-full">
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="black"
                  canvasProps={{
                    className: 'w-full h-full cursor-crosshair',
                  }}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearSignature}
                className="mt-3"
              >
                Clear Signature
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold bg-[#F15A29] hover:bg-[#d94c1e] text-white" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                'Submit Membership Application'
              )}
            </Button>
            <p className="text-center text-sm text-gray-500 mt-3">
              By submitting, you agree to have union fees deducted from your salary
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
