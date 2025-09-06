import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useSignup } from '@/hooks/auth-hooks'
import { Loader2 } from 'lucide-react'

const signupSchema = z.object({
  username: z.string()
    .min(3, 'Kullanıcı adı en az 3 karakter olmalıdır')
    .regex(/^[a-zA-Z0-9_]+$/, 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir'),
  email: z.string().email('Geçerli bir email adresi girin'),
  password: z.string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .max(128, 'Şifre en fazla 128 karakter olabilir'),
  confirmPassword: z.string(),
  tos: z.boolean().refine(val => val === true, 'Hizmet şartlarını kabul etmelisiniz'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
})

type SignupFormData = z.infer<typeof signupSchema>

export function SignupForm() {
  const { mutate: signup, isPending } = useSignup()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const tosValue = watch('tos')

  const onSubmit = (data: SignupFormData) => {
    const { confirmPassword, ...signupData } = data
    signup(signupData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Kullanıcı Adı</Label>
        <Input
          id="username"
          type="text"
          placeholder="kullaniciadi"
          {...register('username')}
          className={errors.username ? 'border-red-500' : ''}
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="ornek@email.com"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Şifre</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
          className={errors.confirmPassword ? 'border-red-500' : ''}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="tos"
          checked={tosValue}
          onCheckedChange={(checked) => setValue('tos', checked as boolean)}
        />
        <Label htmlFor="tos" className="text-sm">
          <a href="/terms" target="_blank" className="text-primary hover:underline">
            Hizmet şartlarını
          </a> kabul ediyorum
        </Label>
      </div>
      {errors.tos && (
        <p className="text-sm text-red-500">{errors.tos.message}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Hesap Oluştur
      </Button>
    </form>
  )
}