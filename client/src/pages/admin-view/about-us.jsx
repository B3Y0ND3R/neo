import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
import axios from 'axios';

const AboutUsAdmin = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [aboutData, setAboutData] = useState({
    hero: { title: '', subtitle: '' },
    features: [],
    story: { title: '', content: [], image: '' },
    stats: [],
    team: []
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/about-us');
      if (response.data) {
        setAboutData(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch about us data"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put('http://localhost:5000/api/about-us', aboutData, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        // Update the local state with the response from server
        setAboutData(response.data);
        toast({
          title: "Success",
          description: "About us page updated successfully"
        });
      }
    } catch (error) {
      console.error('Error updating data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to update about us page"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSection = (section, value) => {
    setAboutData(prev => ({
      ...prev,
      [section]: value
    }));
  };

  const deleteFeature = async (index) => {
    try {
      setIsLoading(true);
      const newFeatures = [...aboutData.features];
      newFeatures.splice(index, 1);
      const updatedData = { ...aboutData, features: newFeatures };
      
      const response = await axios.put('http://localhost:5000/api/about-us', updatedData, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        setAboutData(updatedData);
        toast({
          title: "Success",
          description: "Feature deleted successfully"
        });
      }
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete feature"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStat = async (index) => {
    try {
      setIsLoading(true);
      const newStats = [...aboutData.stats];
      newStats.splice(index, 1);
      const updatedData = { ...aboutData, stats: newStats };
      
      const response = await axios.put('http://localhost:5000/api/about-us', updatedData, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        setAboutData(updatedData);
        toast({
          title: "Success",
          description: "Stat deleted successfully"
        });
      }
    } catch (error) {
      console.error('Error deleting stat:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete stat"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTeamMember = async (index) => {
    try {
      setIsLoading(true);
      const newTeam = [...aboutData.team];
      newTeam.splice(index, 1);
      const updatedData = { ...aboutData, team: newTeam };
      
      const response = await axios.put('http://localhost:5000/api/about-us', updatedData, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        setAboutData(updatedData);
        toast({
          title: "Success",
          description: "Team member deleted successfully"
        });
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete team member"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStoryParagraph = async (index) => {
    try {
      setIsLoading(true);
      const newContent = [...aboutData.story.content];
      newContent.splice(index, 1);
      const updatedData = { 
        ...aboutData, 
        story: { ...aboutData.story, content: newContent }
      };
      
      const response = await axios.put('http://localhost:5000/api/about-us', updatedData, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        setAboutData(updatedData);
        toast({
          title: "Success",
          description: "Paragraph deleted successfully"
        });
      }
    } catch (error) {
      console.error('Error deleting paragraph:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete paragraph"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !aboutData.hero.title) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Edit About Us Page</h1>

      <Tabs defaultValue="hero">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="story">Story</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={aboutData.hero.title}
                  onChange={(e) => updateSection('hero', { ...aboutData.hero, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Subtitle</label>
                <Textarea
                  value={aboutData.hero.subtitle}
                  onChange={(e) => updateSection('hero', { ...aboutData.hero, subtitle: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aboutData.features.map((feature, index) => (
                <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 mb-4 items-start">
                  <Input
                    placeholder="Icon"
                    value={feature.icon}
                    onChange={(e) => {
                      const newFeatures = [...aboutData.features];
                      newFeatures[index] = { ...feature, icon: e.target.value };
                      updateSection('features', newFeatures);
                    }}
                  />
                  <Input
                    placeholder="Title"
                    value={feature.title}
                    onChange={(e) => {
                      const newFeatures = [...aboutData.features];
                      newFeatures[index] = { ...feature, title: e.target.value };
                      updateSection('features', newFeatures);
                    }}
                  />
                  <Input
                    placeholder="Description"
                    value={feature.description}
                    onChange={(e) => {
                      const newFeatures = [...aboutData.features];
                      newFeatures[index] = { ...feature, description: e.target.value };
                      updateSection('features', newFeatures);
                    }}
                  />
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => deleteFeature(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => updateSection('features', [...aboutData.features, { icon: '', title: '', description: '' }])}
              >
                Add Feature
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="story">
          <Card>
            <CardHeader>
              <CardTitle>Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={aboutData.story.title}
                  onChange={(e) => updateSection('story', { ...aboutData.story, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Image URL</label>
                <Input
                  value={aboutData.story.image}
                  onChange={(e) => updateSection('story', { ...aboutData.story, image: e.target.value })}
                />
              </div>
              {aboutData.story.content.map((paragraph, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <Textarea
                    value={paragraph}
                    onChange={(e) => {
                      const newContent = [...aboutData.story.content];
                      newContent[index] = e.target.value;
                      updateSection('story', { ...aboutData.story, content: newContent });
                    }}
                    className="flex-1"
                  />
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => deleteStoryParagraph(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => updateSection('story', {
                  ...aboutData.story,
                  content: [...aboutData.story.content, '']
                })}
              >
                Add Paragraph
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aboutData.stats.map((stat, index) => (
                <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-4 mb-4 items-start">
                  <Input
                    placeholder="Value"
                    value={stat.value}
                    onChange={(e) => {
                      const newStats = [...aboutData.stats];
                      newStats[index] = { ...stat, value: e.target.value };
                      updateSection('stats', newStats);
                    }}
                  />
                  <Input
                    placeholder="Label"
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...aboutData.stats];
                      newStats[index] = { ...stat, label: e.target.value };
                      updateSection('stats', newStats);
                    }}
                  />
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => deleteStat(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => updateSection('stats', [...aboutData.stats, { value: '', label: '' }])}
              >
                Add Stat
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aboutData.team.map((member, index) => (
                <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 mb-4 items-start">
                  <Input
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) => {
                      const newTeam = [...aboutData.team];
                      newTeam[index] = { ...member, name: e.target.value };
                      updateSection('team', newTeam);
                    }}
                  />
                  <Input
                    placeholder="Position"
                    value={member.position}
                    onChange={(e) => {
                      const newTeam = [...aboutData.team];
                      newTeam[index] = { ...member, position: e.target.value };
                      updateSection('team', newTeam);
                    }}
                  />
                  <Input
                    placeholder="Image URL"
                    value={member.image}
                    onChange={(e) => {
                      const newTeam = [...aboutData.team];
                      newTeam[index] = { ...member, image: e.target.value };
                      updateSection('team', newTeam);
                    }}
                  />
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => deleteTeamMember(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => updateSection('team', [...aboutData.team, { name: '', position: '', image: '' }])}
              >
                Add Team Member
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          className="w-full md:w-auto"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default AboutUsAdmin; 