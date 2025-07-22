import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);


// --- TYPE DEFINITIONS ---

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onResetPassword?: () => void;
  onCreateAccount?: () => void;
  isCreateAccount?: boolean;
  onBackToSignIn?: () => void;
  error?: string | null;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm transition-colors focus-within:border-blue-400/70 focus-within:bg-blue-500/10">
    {children}
  </div>
);

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial, delay: string }) => (
  <div className={`animate-testimonial ${delay} flex items-start gap-3 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/10 p-5 w-64`}>
    <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-2xl" alt="avatar" />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-medium">{testimonial.name}</p>
      <p className="text-gray-600">{testimonial.handle}</p>
      <p className="mt-1 text-gray-700">{testimonial.text}</p>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export const SignInPage: React.FC<SignInPageProps> = ({
  title = <span className="font-light text-gray-900 tracking-tighter">Welcome</span>,
  description = "Access your account and continue your journey with us",
  heroImageSrc,
  testimonials = [],
  onSignIn,
  onGoogleSignIn,
  onResetPassword,
  onCreateAccount,
  isCreateAccount = false,
  onBackToSignIn,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full overflow-x-hidden overflow-y-auto">
      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-start justify-center p-6 overflow-y-auto md:items-center md:p-8 py-8">
        <div className="w-full max-w-md py-6 md:py-4">
          <div className="flex flex-col gap-6 md:gap-6">
            <h1 className="animate-element animate-delay-100 text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">{title}</h1>
            <p className="animate-element animate-delay-200 text-gray-600 text-base md:text-base">{description}</p>

            {error && (
              <div className="animate-element animate-delay-250 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form className="space-y-5 md:space-y-5" onSubmit={onSignIn}>
              <div className="animate-element animate-delay-300">
                <label className="text-sm font-medium text-gray-600 md:text-sm">Email Address</label>
                <GlassInputWrapper>
                  <input name="email" type="email" placeholder="Enter your email address" className="w-full bg-transparent text-base p-4 rounded-2xl focus:outline-none md:text-sm md:p-4" />
                </GlassInputWrapper>
              </div>

              {isCreateAccount && (
                <div className="animate-element animate-delay-350">
                  <label className="text-sm font-medium text-gray-600 md:text-sm">Full Name</label>
                  <GlassInputWrapper>
                    <input name="fullName" type="text" placeholder="Enter your full name" className="w-full bg-transparent text-base p-4 rounded-2xl focus:outline-none md:text-sm md:p-4" />
                  </GlassInputWrapper>
                </div>
              )}

              {isCreateAccount && (
                <div className="animate-element animate-delay-375">
                  <label className="text-sm font-medium text-gray-600 md:text-sm">Fireflies API Key</label>
                  <GlassInputWrapper>
                    <input name="firefliesApiKey" type="password" placeholder="Enter your Fireflies API key" required className="w-full bg-transparent text-base p-4 rounded-2xl focus:outline-none md:text-sm md:p-4" />
                  </GlassInputWrapper>
                  <p className="text-xs text-gray-500 mt-1">
                    Required: Get your API key from <a href="https://fireflies.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Fireflies.ai</a> → Settings → Integrations → API
                  </p>
                </div>
              )}

              <div className="animate-element animate-delay-400">
                <label className="text-sm font-medium text-gray-600 md:text-sm">Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="w-full bg-transparent text-base p-4 pr-12 rounded-2xl focus:outline-none md:text-sm md:p-4 md:pr-12" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center md:right-3">
                      {showPassword ? <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors md:w-5 md:h-5" /> : <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors md:w-5 md:h-5" />}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              {isCreateAccount && (
                <div className="animate-element animate-delay-475">
                  <label className="text-sm font-medium text-gray-600 md:text-sm">Confirm Password</label>
                  <GlassInputWrapper>
                    <div className="relative">
                      <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" className="w-full bg-transparent text-base p-4 pr-12 rounded-2xl focus:outline-none md:text-sm md:p-4 md:pr-12" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-3 flex items-center md:right-3">
                        {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors md:w-5 md:h-5" /> : <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors md:w-5 md:h-5" />}
                      </button>
                    </div>
                  </GlassInputWrapper>
                </div>
              )}

              <div className="animate-element animate-delay-525 flex items-start justify-between text-sm gap-3 md:text-sm md:gap-2">
                {isCreateAccount ? (
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" name="agreeToTerms" required className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-0.5 md:w-4 md:h-4" />
                    <span className="text-gray-700 text-sm leading-relaxed md:text-sm">I agree to the Terms of Service</span>
                  </label>
                ) : (
                  <>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" name="rememberMe" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 md:w-4 md:h-4" />
                      <span className="text-gray-700 text-sm md:text-sm">Keep me signed in</span>
                    </label>
                    <a href="#" onClick={(e) => { e.preventDefault(); onResetPassword?.(); }} className="hover:underline text-blue-600 transition-colors text-sm md:text-sm">Reset password</a>
                  </>
                )}
              </div>

              <button type="submit" className="animate-element animate-delay-550 w-full rounded-2xl bg-blue-600 py-4 font-medium text-white hover:bg-blue-700 transition-colors text-base md:py-4 md:text-base">
                {isCreateAccount ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="animate-element animate-delay-575 relative flex items-center justify-center my-4 md:my-0">
              <span className="w-full border-t border-gray-200"></span>
              <span className="px-4 text-sm text-gray-500 bg-white absolute md:px-4 md:text-sm">Or continue with</span>
            </div>

            <button onClick={onGoogleSignIn} className="animate-element animate-delay-600 w-full flex items-center justify-center gap-3 border border-gray-200 rounded-2xl py-4 hover:bg-gray-50 transition-colors text-base md:gap-3 md:py-4 md:text-base">
                <GoogleIcon />
                {isCreateAccount ? 'Sign up with Google' : 'Continue with Google'}
            </button>

            <p className="animate-element animate-delay-625 text-center text-sm text-gray-600 leading-relaxed md:text-sm">
              {isCreateAccount ? (
                <>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onBackToSignIn?.(); }} className="text-blue-600 hover:underline transition-colors">Sign In</a></>
              ) : (
                <>New to our platform? <a href="#" onClick={(e) => { e.preventDefault(); onCreateAccount?.(); }} className="text-blue-600 hover:underline transition-colors">Create Account</a></>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Right column: hero image + testimonials */}
      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative md:p-4">
          <div className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${heroImageSrc})` }}></div>
          {testimonials.length > 0 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center">
              <TestimonialCard testimonial={testimonials[0]} delay="animate-delay-1000" />
              {testimonials[1] && <div className="hidden xl:flex"><TestimonialCard testimonial={testimonials[1]} delay="animate-delay-1200" /></div>}
              {testimonials[2] && <div className="hidden 2xl:flex"><TestimonialCard testimonial={testimonials[2]} delay="animate-delay-1400" /></div>}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

