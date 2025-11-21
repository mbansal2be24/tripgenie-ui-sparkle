import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Upload, MapPin, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { placeSubmissionSchema } from "@shared/schema";
import { z } from "zod";

const formSchema = placeSubmissionSchema.extend({
  image: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function UploadPlace() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const submitPlaceMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("latitude", data.latitude.toString());
      formData.append("longitude", data.longitude.toString());
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const response = await fetch("/api/places/submit", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to submit place");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setVerificationResult(data);
      toast({
        title: data.status === "verified" ? "Place Verified!" : "Place Under Review",
        description: data.message,
      });
      
      // Reset form if verified
      if (data.status === "verified") {
        form.reset();
        setImagePreview(null);
        setSelectedFile(null);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      toast({
        title: "Getting location...",
        description: "Please allow location access",
      });
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("latitude", position.coords.latitude);
          form.setValue("longitude", position.coords.longitude);
          toast({
            title: "Location obtained!",
            description: `Lat: ${position.coords.latitude.toFixed(6)}, Lon: ${position.coords.longitude.toFixed(6)}`,
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Could not get your location. Please enter manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Not supported",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: FormData) => {
    if (!selectedFile) {
      toast({
        title: "Image required",
        description: "Please upload a photo of the place",
        variant: "destructive",
      });
      return;
    }
    submitPlaceMutation.mutate(data);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-8" data-testid="page-upload-place">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="heading-page-title">
            Submit an Underrated Place
          </h1>
          <p className="text-muted-foreground" data-testid="text-page-subtitle">
            Share hidden gems with automatic verification
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card data-testid="card-place-details">
              <CardHeader>
                <CardTitle data-testid="heading-place-details">Place Details</CardTitle>
                <CardDescription data-testid="text-place-details-description">
                  Upload a photo and provide details about this hidden gem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-submit-place">
                    {/* Image Upload */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium" data-testid="label-photo">Photo</label>
                      <div className="flex flex-col gap-4">
                        <Input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleImageChange}
                          data-testid="input-image"
                        />
                        {imagePreview && (
                          <div className="relative w-full h-64 rounded-md overflow-hidden border" data-testid="preview-image">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              data-testid="img-preview"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel data-testid="label-place-name">Place Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Hidden Waterfall in Coorg"
                              data-testid="input-title"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage data-testid="error-title" />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel data-testid="label-description">Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us what makes this place special..."
                              className="min-h-32"
                              data-testid="input-description"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription data-testid="text-description-hint">
                            Minimum 10 characters
                          </FormDescription>
                          <FormMessage data-testid="error-description" />
                        </FormItem>
                      )}
                    />

                    {/* Location */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium" data-testid="label-location">Location Coordinates</label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleGetCurrentLocation}
                          data-testid="button-get-location"
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          Use Current Location
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="latitude"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel data-testid="label-latitude">Latitude</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="any"
                                  placeholder="12.9716"
                                  data-testid="input-latitude"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage data-testid="error-latitude" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="longitude"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel data-testid="label-longitude">Longitude</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="any"
                                  placeholder="77.5946"
                                  data-testid="input-longitude"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage data-testid="error-longitude" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        disabled={submitPlaceMutation.isPending}
                        data-testid="button-submit"
                      >
                        {submitPlaceMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Submit Place
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setLocation("/home")}
                        data-testid="button-cancel"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Verification Info Sidebar */}
          <div className="space-y-6">
            <Card data-testid="card-verification-info">
              <CardHeader>
                <CardTitle className="text-lg" data-testid="heading-verification-process">Verification Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3" data-testid="info-exif-check">
                  <Check className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium text-sm" data-testid="text-exif-title">EXIF Location Check</p>
                    <p className="text-xs text-muted-foreground" data-testid="text-exif-description">
                      We verify the photo was taken within 500m of the submitted location
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3" data-testid="info-reverse-search">
                  <Check className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium text-sm" data-testid="text-reverse-title">Reverse Image Search</p>
                    <p className="text-xs text-muted-foreground" data-testid="text-reverse-description">
                      Ensuring the image is original and not found online
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3" data-testid="info-ai-detection">
                  <Check className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium text-sm" data-testid="text-ai-title">AI Fake Detection</p>
                    <p className="text-xs text-muted-foreground" data-testid="text-ai-description">
                      Checking if the image is AI-generated
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {verificationResult && (
              <Card data-testid="card-verification-result">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2" data-testid="heading-verification-status">
                    {verificationResult.status === "verified" ? (
                      <>
                        <Check className="w-5 h-5 text-success" data-testid="icon-verified" />
                        Verified!
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-warning" data-testid="icon-under-review" />
                        Under Review
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium" data-testid="text-result-place-title">Place: {verificationResult.place.title}</p>
                    <p className="text-xs text-muted-foreground mt-1" data-testid="text-result-status">
                      Status: {verificationResult.place.status}
                    </p>
                  </div>
                  {verificationResult.place.verificationDetails && (
                    <div className="space-y-2 pt-3 border-t" data-testid="section-verification-details">
                      <p className="text-xs font-medium" data-testid="heading-verification-details">Verification Details:</p>
                      <div className="space-y-1.5 text-xs text-muted-foreground">
                        <p data-testid="text-exif-distance">EXIF Distance: {verificationResult.place.verificationDetails.exifDistance}</p>
                        <p data-testid="text-exif-coords">EXIF Coords: {verificationResult.place.verificationDetails.exifCoords}</p>
                        <p data-testid="text-image-found">Image Found Online: {verificationResult.place.verificationDetails.reverseImageFound ? "Yes" : "No"}</p>
                        <p data-testid="text-ai-score">AI Fake Score: {verificationResult.place.verificationDetails.aiFakeScore}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
