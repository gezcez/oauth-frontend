import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useGetApps, useLogout } from "@/hooks/auth-hooks"
import { useAuthStore } from "@/stores/auth-store"
import { Loader2, ExternalLink, LogOut } from "lucide-react"

interface App {
	key: string
	name: string
	redirect_uri: string
}

interface AppSelectorProps {
	onAppSelect: (appKey: string) => void
}

export function AppSelector({ onAppSelect }: AppSelectorProps) {
	const { user } = useAuthStore()
	const { data: apps, isLoading, error } = useGetApps()
	const { mutate: logout, isPending: isLoggingOut } = useLogout()

	const handleLogout = () => {
		logout()
	}

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<Card className="w-full max-w-md">
					<CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
						<Loader2 className="h-8 w-8 animate-spin" />
						<p className="text-center text-muted-foreground">
							Uygulamalar yükleniyor...
						</p>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
				<Card className="w-full max-w-md">
					<CardHeader className="text-center">
						<CardTitle className="text-2xl font-bold text-red-600">
							Hata
						</CardTitle>
						<CardDescription>
							Uygulamalar yüklenirken bir hata oluştu
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-sm text-muted-foreground text-center">
							{error.message || "Bilinmeyen bir hata oluştu"}
						</p>
						<Button className="w-full">Tekrar Dene</Button>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<Card className="w-full max-w-lg">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">
						Merhaba, {user?.username}!
					</CardTitle>
					<CardDescription>
						Giriş yapmak istediğiniz uygulamaya tıklayın.
					</CardDescription>
					<CardDescription className="text-slate-400">
						[temporary page by claude sonnet 4]
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{apps && apps.length > 0 ? (
						(() => {
							const availableApps = apps.filter((app: App) => app.redirect_uri)
							return availableApps.length > 0 ? (
								<div className="grid gap-3">
									{availableApps.map((app: App) => (
										<Button
											key={app.key}
											onClick={() => onAppSelect(app.key)}
											variant="outline"
											className="flex w-full items-center justify-between p-4 h-auto"
										>
											<div className="flex flex-col items-start">
												<span className="font-semibold">{app.name}</span>
												<span className="text-sm text-muted-foreground">
													{app.key}
												</span>
											</div>
											<ExternalLink className="h-4 w-4" />
										</Button>
									))}
								</div>
							) : (
								<div className="text-center py-8">
									<p className="text-muted-foreground">
										Erişilebilir uygulama bulunamadı
									</p>
									<p className="text-xs text-muted-foreground mt-2">
										Uygulamaların redirect URL'si yapılandırılmamış
									</p>
								</div>
							)
						})()
					) : (
						<div className="text-center py-8">
							<p className="text-muted-foreground">Hiç uygulama bulunamadı</p>
						</div>
					)}

					<div className="pt-4 border-t">
						<Button
							onClick={handleLogout}
							variant="ghost"
							className="w-full text-muted-foreground"
							disabled={isLoggingOut}
						>
							{isLoggingOut ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Çıkış yapılıyor...
								</>
							) : (
								<>
									<LogOut className="mr-2 h-4 w-4" />
									Çıkış Yap
								</>
							)}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
